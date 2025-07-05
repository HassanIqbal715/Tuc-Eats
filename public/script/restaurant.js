import * as utils from "./utils.js";
import { 
    fetchSearchRestaurantFoodByName,
    fetchSearchRestaurantDrinksByName,
    deleteItemByID,
    fetchCurrentUser
 } from './utils.js';

const restaurantName = document.querySelector("#restaurant-name");
const restaurantCover = document.querySelector("#restaurant-cover");
const restaurantContact = document.querySelector("#restaurant-phonenumbers");
const restaurantDescription = document.querySelector("#restaurant-description");

const itemsGrid = document.querySelector("#items-grid");
const itemsSearchBar = document.querySelector("#items-search-bar");
const itemsSearchButton = document.querySelector("#items-search-button");
const recommendMeButton = document.querySelector("#recommendation");

const drinksButton = document.querySelector("#items-header-drinks");
const foodButton = document.querySelector("#items-header-food");

const restaurantId = window.location.pathname.split('/').pop();

const restaurantDetails = await utils.fetchRestaurantByID(restaurantId);
const restaurantPhonenumbers = await utils.fetchRestaurantContactsByID(restaurantId);
const foodDetails = await utils.fetchFoodByRestaurantID(restaurantId);
const drinkDetails = await utils.fetchDrinksByRestaurantID(restaurantId);

// Admin panel
const adminHeader = document.querySelector("#admin-header");
const adminAddItemBtn = document.querySelector("#admin-addItem"); 
const adminRemoveItemBtn = document.querySelector("#admin-removeItem");
const adminEditItemBtn = document.querySelector("#admin-editItem");
const adminRidersBtn = document.querySelector("#admin-riders");
const adminOrdersBtn = document.querySelector("#admin-orders");

const removeItemText = document.querySelector("#admin-remove-item-text");
const adminConfirmFooter = document.querySelector("#admin-confirm-footer");
const adminConfirmText = document.querySelector("#admin-confirm-text");
const adminConfirmButton = document.querySelector("#admin-confirm-button");
const backgroundBlur = document.querySelector("#background-blur");
const deletePromptBox = document.querySelector("#delete-prompt-box");
const deleteConfirmButton = document.querySelector("#delete-confirm-button");
const deleteRejectButton = document.querySelector("#delete-reject-button");

let isEditActive = false;
let deleteActive = false;
let editActive = false;
let itemsSelected = 0;
let selectedItemIds = []; 

// Item Select box
const itemSelectBox = document.querySelector("#item-select-box");
const itemSelectName = document.querySelector("#item-select-name");
const itemSelectPriceBox = document.querySelector("#item-select-price");
const itemSelectImage = document.querySelector("#item-select-image");
const itemSizesContainer = document.querySelector("#item-sizes-container");
const itemCartButton = document.querySelector("#item-addToCart-button");
const itemBackButton = document.querySelector("#item-back-button");
const itemQuantityBox = document.querySelector("#item-quantity");
const itemQuantityAdd = document.querySelector("#item-quantity-add");
const itemQuantitySub = document.querySelector("#item-quantity-sub");
const itemSelectLoginPrompt = document.querySelector("#item-select-login-prompt");

let itemSelectVarID = 0;
let itemSelectPrice = 0;
let itemQuantity = 1;

// Tells which section is currently displayed on the screen (food or drinks)
let isFoodSection = false;

utils.checkAuthenticationWithType(restaurantId, adminHeader, 'flex');

async function userAuthentication() {
    if (await utils.checkUserAuthentication() == true) {
        itemCartButton.style.display = 'flex';
        itemSelectLoginPrompt.style.display = 'none';
    }
    itemSelectBox.style.gap = '15px';
}

function createItem(id, name, price, imageLink) {
    const itemBox = document.createElement("div");
    itemBox.id = id;
    itemBox.classList.add("item-box");

    const itemImage = document.createElement("img");
    itemImage.classList.add("item-image");
    itemImage.src = imageLink;
    console.log(imageLink);

    const itemDescription = document.createElement("div");
    itemDescription.classList.add("item-descrption");

    const itemName = document.createElement("p");
    itemName.classList.add("item-name");
    itemName.textContent = name;

    const itemPrice = document.createElement("div");
    itemPrice.classList.add("item-price");

    const itemPriceRS = document.createElement("p");
    itemPriceRS.style.color = "#E28400";
    itemPriceRS.textContent = "Rs";

    const itemPriceContent = document.createElement("p");
    itemPriceContent.style.color = "Black";
    itemPriceContent.textContent = price;

    itemPrice.appendChild(itemPriceRS);
    itemPrice.appendChild(itemPriceContent);
    itemDescription.appendChild(itemName);
    itemDescription.appendChild(itemPrice);
    itemBox.appendChild(itemImage);
    itemBox.appendChild(itemDescription);

    itemBox.addEventListener("click", () => {
        if (isEditActive == true)
            itemAdminClick(itemBox);
        else {
            itemUserClick(itemBox);
        }
    });

    if (selectedItemIds.includes(String(id))) {
        itemBox.classList.add("selected");
        const greenTick = document.createElement("img");
        greenTick.src = '/images/green-tick.png';
        greenTick.classList.add("green-tick");
        itemBox.appendChild(greenTick);
    }

    itemsGrid.appendChild(itemBox);
}

function createItemSizeButton(id, sizeName, price, flag) {
    let btn = document.createElement("div");
    btn.classList.add("item-size-button");
    btn.textContent = sizeName;
    btn.addEventListener("click", ()=> {
        let allButtons = document.querySelectorAll(".item-size-button");
        allButtons.forEach(button => {
            button.style.backgroundColor = "";
            button.style.color = "black";
        });
        btn.style.backgroundColor = "#E28400";
        btn.style.color = "white";
        itemSelectPrice = parseInt(price) * itemQuantity;
        itemSelectPriceBox.textContent = itemSelectPrice;
        itemSelectVarID = id;
    });
    if (flag == false) {
        btn.style.backgroundColor = "#E28400";
        btn.style.color = "white";
        itemSelectPriceBox.textContent = price;
        itemSelectPrice = parseInt(price);
        itemSelectVarID = id;
    }

    itemSizesContainer.appendChild(btn);
}

async function showItemWindow(item_id) {
    let item = await utils.fetchItemsByRestaurantIDAndItemID(restaurantId, item_id);
    let restaurantDetails = await utils.fetchRestaurantByID(restaurantId);
    let itemVariants = await utils.fetchItemVariantsByItemID(item_id);
    document.querySelector("#item-restaurant-name").textContent = restaurantDetails[0].name;
    itemSelectBox.style.display = 'flex';
    itemSelectName.textContent = item[0].name;
    itemSelectImage.src = item[0].image_link;
    let flag = false;
    for (let x of itemVariants) {
        createItemSizeButton(x.id, x.size, x.price, flag);
        flag = true;
    }
}

function createFoodItems() {
    itemsGrid.innerHTML = '';
    for (let x of foodDetails) {
        createItem(x.id, x.name, x.price, x.image_link);
    }
    console.log(foodDetails);
    itemsSearchBar.placeholder = 'Search Food';
    isFoodSection = true;
}

function createDrinkItems() {
    itemsGrid.innerHTML = '';
    for (let x of drinkDetails) {
        createItem(x.id, x.name, x.price, x.image_link);
    }
    itemsSearchBar.placeholder = 'Search Drink';
    isFoodSection = false;
}

async function searchFoodItems(searchTerm) {
    if (searchTerm !== '') {
        itemsGrid.innerHTML = '';
        let searchResults = await fetchSearchRestaurantFoodByName (restaurantId, searchTerm);
        if (searchResults) {
            for (let x of searchResults) {
                createItem(x.id, x.name, x.price, x.image_Link);
            }
        }
    }
}

async function searchDrinkItems(searchTerm) {
    if (searchTerm !== '') {
        itemsGrid.innerHTML = '';
        let searchResults = await fetchSearchRestaurantDrinksByName (restaurantId, searchTerm);
        if (searchResults) {
            for (let x of searchResults) {
                createItem(x.id, x.name, x.price, x.image_Link);
            }
        }
    }
}

function toggleRemoveItem() {
    if (deleteActive == false) {
        removeItemText.textContent = "Please select the item that you want to delete.";
        adminConfirmButton.textContent = "Delete";
        adminConfirmFooter.style.display = 'flex';
        isEditActive = true;
        deleteActive = true;
        editActive = false;
        itemsSelected = 0;
        selectedItemIds = [];
        adminConfirmText.textContent = "Items Selected 0";
    } else {
        removeItemText.innerHTML = '';
        adminConfirmFooter.style.display = 'none';
        isEditActive = false;
        deleteActive = false;
        itemsSelected = 0;
        selectedItemIds = [];

        const selectedItems = document.querySelectorAll('.item-box.selected');
        selectedItems.forEach(item => {
            item.classList.remove('selected');
            const tick = item.querySelector('.green-tick');
            if (tick) tick.remove();
        });
    }
}

function toggleEditItem() {
    if (!editActive) {
        removeItemText.textContent = "Please select the item that you want to edit.";
        isEditActive = true;
        editActive = true;
        deleteActive = false;
        const selectedItems = document.querySelectorAll('.item-box.selected');
        selectedItems.forEach(item => {
            item.classList.remove('selected');
            const tick = item.querySelector('.green-tick');
            if (tick) tick.remove();
        });
    } else {
        removeItemText.innerHTML = '';
        adminConfirmFooter.style.display = 'none';
        isEditActive = false;
        editActive = false;
    }
}

function itemAdminClick(itemBox) {
    const id = itemBox.id;
    if (editActive == true) {
        window.location.href = `/restaurant/${restaurantId}/edit-item/${parseInt(id)}`;
        return;
    }
    if (deleteActive == true) {
        if (selectedItemIds.includes(id)) {
            selectedItemIds = selectedItemIds.filter(itemId => itemId !== id);
            itemBox.classList.remove("selected");

            const tick = itemBox.querySelector(".green-tick");
            if (tick) tick.remove();

            itemsSelected--;
        } else {
            selectedItemIds.push(id);
            itemBox.classList.add("selected");

            const greenTick = document.createElement("img");
            greenTick.src = '/images/green-tick.png';
            greenTick.classList.add("green-tick");
            itemBox.appendChild(greenTick);

            itemsSelected++;
        }
        adminConfirmText.textContent = "Items Selected " + itemsSelected;
        return;
    }
}

function itemUserClick(itemBox) {
    const id = itemBox.id;
    backgroundBlur.style.display = 'block';
    document.body.style.overflow = 'hidden';
    showItemWindow(id);
}

function itemSearchClick() {
    if (isFoodSection)
        searchFoodItems(itemsSearchBar.value.trim());
    else 
        searchDrinkItems(itemsSearchBar.value.trim());
}

async function recommendationClick() {
    let items;
    if (isFoodSection == true) {
        items = await utils.fetchFoodByRestaurantID(restaurantId);
    }
    else {
        items = await utils.fetchDrinksByRestaurantID(restaurantId);
    }

    let randNum = Math.floor(Math.random() * items.length);
    const itemVar = await utils.fetchItemVariantsByItemID(
        items[randNum].id
    );
    let varIndex = 0;
    let min = itemVar[0].price;
    for (let x = 0; x < itemVar.length; x++){
        if (itemVar[x].price < min) {
            min = itemVar[x].price;
            varIndex = x;
        }
    }
    itemsGrid.innerHTML = '';
    createItem(items[randNum].id, items[randNum].name, 
        itemVar[varIndex].price, items[randNum].image_link);
}

foodButton.addEventListener("click", createFoodItems);
drinksButton.addEventListener("click", createDrinkItems);
itemsSearchButton.addEventListener("click", itemSearchClick);

itemsSearchBar.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        itemSearchClick();
    }
});

if (restaurantDetails) {
    let phonenumbers = "";
    restaurantName.textContent = restaurantDetails[0].name;
    restaurantCover.src = restaurantDetails[0].image_link;
    restaurantDescription.textContent = restaurantDetails[0].description;

    for (let x of restaurantPhonenumbers) {
        phonenumbers += x.phonenumber + "<br>";
    }
    restaurantContact.innerHTML = "<p>" + phonenumbers + "</p>";
}

createFoodItems();

// Admin panel button press
adminRidersBtn.addEventListener("click", () => {
    window.location.href = '/restaurant/' + restaurantId + '/riders/';
});

adminAddItemBtn.addEventListener("click", () => {
    window.location.href = '/restaurant/' + restaurantId + '/add-item/';
});

adminOrdersBtn.addEventListener("click", () => {
    window.location.href = '/restaurant/' + restaurantId + '/orders/'
});

adminRemoveItemBtn.addEventListener("click", toggleRemoveItem);
adminEditItemBtn.addEventListener("click", toggleEditItem);
adminConfirmButton.addEventListener("click", () => {
    backgroundBlur.style.display = 'block';
    deletePromptBox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
});

deleteConfirmButton.addEventListener("click", async () => {
    for (let i = 0; i < selectedItemIds.length; i++) {
        await deleteItemByID(selectedItemIds[i]);
    }
    window.location.reload();
});

deleteRejectButton.addEventListener("click", async () => {
    backgroundBlur.style.display = 'none';
    deletePromptBox.style.display = 'none';
    document.body.style.overflow = '';
});

itemQuantityAdd.addEventListener("click", ()=> {
    itemSelectPrice = itemSelectPrice/itemQuantity;
    itemQuantity++;
    itemQuantityBox.textContent = itemQuantity;
    itemSelectPrice = itemSelectPrice * itemQuantity;
    itemSelectPriceBox.textContent = itemSelectPrice;
});

itemQuantitySub.addEventListener("click", ()=> {
    if (itemQuantity == 1)
        return;
    itemSelectPrice = itemSelectPrice/itemQuantity;
    itemQuantity--;
    itemQuantityBox.textContent = itemQuantity;
    itemSelectPrice = itemSelectPrice * itemQuantity;
    itemSelectPriceBox.textContent = itemSelectPrice;
});

itemCartButton.addEventListener("click", async ()=> {
    let user = await fetchCurrentUser();
    let cartID = user[0].id;
    const newCartItem = {
        id: parseInt(cartID),
        itemVarID: parseInt(itemSelectVarID),
        quantity: parseInt(itemQuantity)
    };
    await utils.insertCartItem(newCartItem);
    itemSelectPrice = 0;
    itemSelectVarID = 0;
    itemQuantity = 1;
    itemQuantityBox.textContent = 1;
    itemSelectBox.style.display = 'none';
    itemSizesContainer.innerHTML = '';
    backgroundBlur.style.display = 'none';
    document.body.style.overflow = '';
    window.location.reload();
});

itemBackButton.addEventListener("click", ()=> {
    itemSelectPrice = 0;
    itemSelectVarID = 0;
    itemQuantity = 1;
    itemQuantityBox.textContent = 1;
    itemSelectBox.style.display = 'none';
    itemSizesContainer.innerHTML = '';
    backgroundBlur.style.display = 'none';
    document.body.style.overflow = '';
});

recommendMeButton.addEventListener("click", recommendationClick);

userAuthentication();