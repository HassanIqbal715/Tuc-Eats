import { 
    fetchItemsByName,
    fetchCurrentUser
 } from "./utils.js";

import * as utils from './utils.js';

const itemsGrid = document.querySelector("#items-grid");
const searchResultsTitle = document.querySelector("#search-results-text");
let searchTerm = new URLSearchParams(window.location.search).get('name');

let itemSelectBox;
let itemSelectName;
let itemSelectPriceBox;
let itemSelectImage;
let itemSizesContainer;
let itemCartButton;
let itemBackButton;
let itemQuantityBox;
let itemQuantityAdd;
let itemQuantitySub;
let itemSelectLoginPrompt;
let backgroundBlur;

let itemSelectVarID = 0;
let itemSelectPrice = 0;
let itemQuantity = 1;

console.log(searchTerm);

export async function init() {
    itemSelectBox = document.querySelector("#item-select-box");
    itemSelectName = document.querySelector("#item-select-name");
    itemSelectPriceBox = document.querySelector("#item-select-price");
    itemSelectImage = document.querySelector("#item-select-image");
    itemSizesContainer = document.querySelector("#item-sizes-container");
    itemCartButton = document.querySelector("#item-addToCart-button");
    itemBackButton = document.querySelector("#item-back-button");
    itemQuantityBox = document.querySelector("#item-quantity");
    itemQuantityAdd = document.querySelector("#item-quantity-add");
    itemQuantitySub = document.querySelector("#item-quantity-sub");
    itemSelectLoginPrompt = document.querySelector("#item-select-login-prompt");
    backgroundBlur = document.querySelector("#background-blur");

    await searchResults();
    await setupEventListeners();
    await userAuthentication();
}

async function setupEventListeners() {
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
}

function createItem(id, name, price, imageLink) {
    const itemBox = document.createElement("div");
    itemBox.id = parseInt(id);
    itemBox.classList.add("item-box");

    const itemImage = document.createElement("img");
    itemImage.classList.add("item-image");
    itemImage.src = imageLink;

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
        itemUserClick(itemBox);
    });

    itemsGrid.appendChild(itemBox);
}

async function searchResults() {
    if (searchTerm) {
        let items = await fetchItemsByName(searchTerm);
        if (items[0]) {
            for (let x of items) {
                console.log(x);
                createItem(parseInt(x.item_id), x.name, x.min_price, x.image_link);
            }
        }
        else {
            searchResultsTitle.textContent = "No Items Found";
        }
    }
}

// Item
async function userAuthentication() {
    if (await utils.checkUserAuthentication() == true) {
        itemCartButton.style.display = 'flex';
        itemSelectLoginPrompt.style.display = 'none';
    }
    itemSelectBox.style.gap = '15px';
}

function createItemSizeButton(id, sizeName, price, flag) {
    let btn = document.createElement("div");
    btn.classList.add("item-size-button");
    btn.textContent = sizeName;
    btn.addEventListener("click", ()=> {
        let allButtons = document.querySelectorAll(".item-size-button");
        allButtons.forEach(button => {
            button.style.backgroundColor = "white";
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
    let item = await utils.fetchItemsByItemID(item_id);
    let itemVariants = await utils.fetchItemVariantsByItemID(item_id);
    let restaurantDetails = await utils.fetchRestaurantByID(item[0].restaurant_id);
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

function itemUserClick(itemBox) {
    const id = itemBox.id;
    backgroundBlur.style.display = 'block';
    document.body.style.overflow = 'hidden';
    showItemWindow(id);
}