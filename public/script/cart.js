import * as utils from './utils.js';

const itemsContainer = document.querySelector("#items-container");
const itemsTotalPrice = document.querySelector("#items-total-price");
const itemsDeliveryCharges = document.querySelector("#delivery-charges");
const checkoutTotalCharges = document.querySelector("#total-charges");
const placeOrderBtn = document.querySelector("#place-order-button");

const userID = parseInt(window.location.pathname.split('/').slice(-2)[0]);

let itemsTotal = 0;
let restaurantIDs = [];

async function userAuthentication() {
    let currentUser = await utils.fetchCurrentUser();
    if (currentUser) {
        if (currentUser[0].id == userID) {
            document.body.style.display = 'block';
            return true;
        }
    }
    return false;
}

function createCartItem(
    id, restaurant_id, name, restaurantName, quantity, price, image_link
) {
    let cartItemID = id;
    let restaurantID = restaurant_id;
    
    let itemBox = document.createElement("div");
    let itemImage = document.createElement("img");
    let itemName = document.createElement("div");
    let restaurantNameBox = document.createElement("div");
    let itemQuantityBox = document.createElement("div");
    let itemQuantityText = document.createElement("div");
    let itemQuantity = document.createElement("div");
    let itemPriceBox = document.createElement("div");
    let itemTotalText = document.createElement("div");
    let itemTotalTextRs = document.createElement("div");
    let itemTotalTextPrice = document.createElement("div");
    let itemDeleteButton = document.createElement("div");

    itemBox.classList.add("item-box");
    itemImage.classList.add("item-image");
    itemName.classList.add("item-text");
    restaurantNameBox.classList.add("item-text");
    itemQuantityBox.classList.add("item-quantity-box");
    itemQuantityText.classList.add("item-text");
    itemQuantity.classList.add("item-number");
    itemPriceBox.classList.add("item-price-box");
    itemTotalText.classList.add("item-text");
    itemTotalTextRs.classList.add("item-price-rs");
    itemTotalTextPrice.classList.add("item-number");
    itemDeleteButton.classList.add("item-delete-button");
    itemDeleteButton.classList.add("item-number");

    itemImage.src = image_link;
    itemName.textContent = name;
    restaurantNameBox.textContent = restaurantName;
    itemQuantityText.textContent = "Qty";
    itemQuantity.textContent = quantity;
    itemTotalText.textContent = "Total";
    itemTotalTextRs.textContent = "Rs";
    itemTotalTextPrice.textContent = price * quantity;
    itemDeleteButton.textContent = "x";

    itemsTotal += parseInt(price * quantity);

    let idFlag = false;
    for (let x of restaurantIDs) {
        if (x == restaurantID) {
            idFlag = true;
            break;
        }
    }
    if (idFlag == false) {
        restaurantIDs.push(restaurantID);
    }

    itemDeleteButton.addEventListener("click", ()=> {
        utils.deleteCartItemByID(cartItemID);
        window.location.reload();
    });

    itemQuantityBox.appendChild(itemQuantityText);
    itemQuantityBox.appendChild(itemQuantity);

    itemPriceBox.appendChild(itemTotalText);
    itemPriceBox.appendChild(itemTotalTextRs);
    itemPriceBox.appendChild(itemTotalTextPrice);

    itemBox.appendChild(itemImage);
    itemBox.appendChild(itemName);
    itemBox.appendChild(restaurantNameBox);
    itemBox.appendChild(itemQuantityBox);
    itemBox.appendChild(itemPriceBox);
    itemBox.appendChild(itemDeleteButton);

    itemsContainer.appendChild(itemBox);
}

async function createItems() {
    let cartItems = await utils.fetchCartItemsByUserID(userID)
    console.log(cartItems);
    for (let x of cartItems) {
        let item = await utils.fetchItemByVariantID(x.item_variant_id);
        let restaurant = await utils.fetchRestaurantByID(parseInt(item[0].restaurant_id));
        console.log(item);
        createCartItem(x.id, item[0].restaurant_id, item[0].name, restaurant[0].name, 
            x.quantity, item[0].price, item[0].image_link);
    }
}

function assignCheckoutValues() {
    itemsTotalPrice.textContent = itemsTotal;
    let count = 0;
    for (let x in restaurantIDs) {
        count++;
    }
    let deliveryCharges = 50 * count;
    itemsDeliveryCharges.textContent = deliveryCharges;
    checkoutTotalCharges.textContent = itemsTotal + deliveryCharges;
}

async function clickCheckoutButton() {
    let userData = await utils.fetchUserByID(userID);
    console.log(userID);
    console.log(userData.data[0]);
    let cartItems = await utils.fetchCartItemsByUserID(userID);
    if (cartItems.length == 0)
        return;
    let orderStatus = 'Pending';
    for (let x of restaurantIDs) {
        let orderData = {
            order_status: orderStatus,
            customer_id: userID,
            restaurant_id: x
        };
        await utils.insertOrder(orderData);
        let latestOrder = await utils.fetchLatestOrder();
        for (let y of cartItems) {
            let item = await utils.fetchItemByVariantID(y.item_variant_id);
            if (item[0].restaurant_id == x) {
                let itemData = {
                    itemVarID: y.item_variant_id,
                    order_id: latestOrder[0].id,
                    quantity: y.quantity
                };
                await utils.insertOrderItem(itemData);
            }
        }
    }
    await utils.deleteCartItemsByCartID(userID);
    window.location.reload();
}

async function execute() {
    if (await userAuthentication()) {
        await createItems();
        assignCheckoutValues();
    }
}

placeOrderBtn.addEventListener("click", clickCheckoutButton);

execute();