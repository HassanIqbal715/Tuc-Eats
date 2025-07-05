import { 
    createError, 
    clearError, 
    fetchItemsByRestaurantID,
    fetchItemsByRestaurantIDAndItemID,
    fetchItemVariantsByItemID,
    updateItem,
    updateItemVariant,
    updateDrink,
    updateFood,
    checkAuthentication,
    insertVariant,
    insertVariantByItemID,
    insertFoodByID,
    deleteItemVariantByID,
    fetchFoodByRestaurantID
} from "./utils.js";

import * as utils from "./utils.js";

const itemName = document.querySelector("#item-name-field");
const itemPrice = document.querySelector("#item-price-field");
const itemImage = document.querySelector("#item-image");

const categoryDropdown = document.querySelector("#item-category-dropdown");
const categoryBox = document.querySelector("#item-category-box");
const categoryFood = document.querySelector("#food-button");
const categoryDrink = document.querySelector("#drink-button");
const categoryText = document.querySelector("#item-category-text");
const categoryArrow = document.querySelector("#category-dropdown-arrow");

const cuisineDropdown = document.querySelector("#cuisine-type-dropdown");
const cuisineBox = document.querySelector("#item-cuisine-box");
const cuisineDesi = document.querySelector("#desi-button");
const cuisineFastFood = document.querySelector("#fast-food-button");
const cuisineChinese = document.querySelector("#chinese-button");
const cuisineBBQ = document.querySelector("#bbq-button");
const cuisineDessert = document.querySelector("#dessert-button");
const cuisineText = document.querySelector("#item-cuisine-text");
const cuisineArrow = document.querySelector("#cuisine-dropdown-arrow");

const sizeDropdown = document.querySelector("#size-type-dropdown");
const sizeBox = document.querySelector("#item-size-box");
const sizeOne = document.querySelector("#size-one");
const sizeTwo = document.querySelector("#size-two");
const sizeThree = document.querySelector("#size-three");
const sizeFour = document.querySelector("#size-four");
const sizeText = document.querySelector("#item-size-text");
const sizeArrow = document.querySelector("#size-dropdown-arrow");

const editButton = document.querySelector("#edit-button");

let isCategoryVisible = false;
let isCuisineVisible = false;
let isSizeVisible = false;

let isCategoryActive = false;
let isCuisineActive = false;
let isSizeActive = false;
let areSizesActive = [0, 0, 0, 0];

let itemCategory = '';
let itemCuisine = '';
let itemSize = '';

let restaurantID = parseInt(window.location.pathname.split('/').slice(-3)[0]);
let itemID = parseInt(window.location.pathname.split('/').slice(-1)[0]);

const allSizePriceContainers = document.querySelectorAll(".size-price-container");

let itemSizes = [];
let itemPrices = [];

function showSizeInputs(count) {
    document.querySelector("#price1").style.width='7vw';
    document.querySelector("#size1").style.display='block';  
    allSizePriceContainers.forEach((container, index) => {
        if (index < count) {
            if (count == 1) {
                document.querySelector("#price1").style.width='15vw';
                document.querySelector("#size1").style.display='none';  
            }
            container.style.display = "flex";
        } else {
            container.style.display = "none";
        }
    });
}

async function assignInputBoxValues() {
    let item = await fetchItemsByRestaurantIDAndItemID(restaurantID, itemID);
    let itemVariants = await fetchItemVariantsByItemID(item[0].id);
    console.log(itemVariants);
    itemName.value = item[0].name;
    for (let i = 0; i < 4; i++) {
        let size = document.querySelector(`#size${i+1}`);
        let price = document.querySelector(`#price${i+1}`);
        if (itemVariants[i]) {
            if (itemVariants[i].size !== 'None')
                size.value = itemVariants[i].size;
            price.value = itemVariants[i].price;
        }
        else {
            return;
        }
    }
}

function assignDropdownValues(placeholder, textBox) {
    textBox.textContent = placeholder;
    textBox.style.color = 'black';
}

async function checkName() {
    let name = itemName.value;
    if (name === '') {
        createError("Name field left empty", "#invalid-name-box");
        return false;
    }

    let itemList = await fetchItemsByRestaurantID(restaurantID);
    let item = await fetchItemsByRestaurantIDAndItemID(restaurantID, itemID);

    if (itemList) {
        for (let x of itemList) {
            if (name.toLowerCase() === x.name.toLowerCase() && name.toLowerCase() !== item[0].name.toLowerCase()) {
                createError("Item already exists", "#invalid-name-box");
                return false;
            }
        }
    }

    clearError("#invalid-name-box");
    return true;
}

function checkSizesAreValid() {
    let size1 = document.querySelector("#size1");
    let size2 = document.querySelector("#size2");
    let size3 = document.querySelector("#size3");
    let size4 = document.querySelector("#size4");

    let sizes = [size1, size2, size3, size4];
    itemSizes = [];

    if (areSizesActive[1] == 0) {
        clearError("#invalid-size-field");
        itemSizes.push('None');
        return true;
    }

    for (let i = 0; i < 4; i++) {
        if (areSizesActive[i] == 1) {
            if (sizes[i].value === '') {
                createError(`Size ${i + 1} empty`, "#invalid-size-field");
                return false;
            }
            if (sizes[i].value.trim().length > 2) {
                createError(`Size ${i + 1} must be of length 2 max`, "#invalid-size-field");
                return false;
            }
            for (let x of itemSizes) {
                if (sizes[i].value.trim().toLowerCase() === x.toLowerCase()) {
                    createError(`Sizes cannot have the same name`, "#invalid-size-field");
                    return false;
                }
            }
            itemSizes.push(sizes[i].value.trim());
        }
    }
    clearError("#invalid-size-field");
    return true;
}

function checkPricesAreValid() {
    let price1 = document.querySelector("#price1");
    let price2 = document.querySelector("#price2");
    let price3 = document.querySelector("#price3");
    let price4 = document.querySelector("#price4");

    let prices = [price1, price2, price3, price4];
    itemPrices = [];

    for (let i = 0; i < 4; i++) {
        if (areSizesActive[i] == 1) {
            if (prices[i].value == '') {
                createError(`Price ${i + 1} empty`, "#invalid-price-field");
                return false;
            }
            let priceInt = parseInt(prices[i].value);
            if (isNaN(priceInt) || priceInt.toString() != priceInt || priceInt <= 0) {
                createError(`Please enter a valid number`, "#invalid-price-field");
                return false;
            }
            itemPrices.push(priceInt);
        }
    }
    clearError("#invalid-price-field");
    return true;
}

function checkCategory() {
    if (itemCategory === '') {
        createError("Please select a category", "#invalid-category-box");
        return false;
    }
    console.log(itemCategory);
    clearError("#invalid-category-box");
    return true;
}

function checkCuisine() {
    if (isCuisineVisible == true && itemCuisine === '') {
        createError("Please select a cuisine", "#invalid-cuisine-box");
        return false;
    }
    clearError("#invalid-cuisine-box");
    return true;
}

function checkSize() {
    if (isSizeVisible == true && itemSize === '') {
        createError("Please select a size", "#invalid-size-box");
        return false;
    }
    clearError("#invalid-size-box");
    return true;
}

async function checkSubmit() {
    if (
        await checkName() == true &
        checkPricesAreValid() == true &
        checkSizesAreValid() == true &
        checkCategory() == true &
        checkCuisine() == true &
        checkSize() == true
    ) {
        const restaurantDetails = await utils.fetchRestaurantByID(restaurantID);        
        if (itemCuisine === '') {
            const newDrink = {
                id: itemID,
                name: itemName.value,
                category: itemCategory,
                image_link: `/images/items/${restaurantDetails[0].name}/${itemName.value}.jpg`
            }
            await updateItem(newDrink);
        }
        else {
            const newFood = {
                id: itemID,
                name: itemName.value,
                category: itemCategory,
                cuisine: itemCuisine,
                image_link: `/images/items/${restaurantDetails[0].name}/${itemName.value}.jpg`          
            }
            await updateItem(newFood);
            let food = await fetchFoodByRestaurantID(restaurantID);
            let flag = false;
            for (let x of food) {
                if (itemID == x.id) {
                    await updateFood(newFood);
                    flag = true;
                    break;
                }
            }
            if (flag == false) {
                await insertFoodByID(itemID, newFood);
            }
        }
        let itemVariants = await fetchItemVariantsByItemID(itemID);
        if (itemVariants.length > itemSizes.length) {
            for (let i = 0; i < itemVariants.length - itemSizes.length; i++) {
                await deleteItemVariantByID(itemVariants[itemVariants.length - i - 1].id);
            }
        }
        for (let i = 0; i < itemSizes.length && i < itemVariants.length; i++) {
            const newVariant = {
                id: itemVariants[i].id,
                size: itemSizes[i],
                price: itemPrices[i]
            }
            await updateItemVariant(newVariant)
        }
        if (itemVariants.length < itemSizes.length) {
            for (let i = itemVariants.length; i < itemSizes.length; i++) {
                const newVariant = {
                    size: itemSizes[i],
                    price: itemPrices[i]
                }
                await insertVariantByItemID(itemID, newVariant);
            }
        }
        return true;
    }
    return false;
}

categoryBox.addEventListener("click", () => {    
    if (isCategoryActive == false) {
        categoryDropdown.style.display = 'block';
        categoryArrow.setAttribute("style", "transform: scaleY(-1);");
        isCategoryActive = true;

        if (isCuisineActive == true) {
            cuisineDropdown.style.display = 'none';
            cuisineArrow.setAttribute("style", "transform: scaleY(1);");
            isCuisineActive = false;
        }
        else if (isSizeActive == true) {
            sizeDropdown.style.display = 'none';
            sizeArrow.setAttribute("style", "transform: scaleY(1);");
            isSizeActive = false;
        }
    }
    else {
        categoryDropdown.style.display = 'none';
        categoryArrow.setAttribute("style", "transform: scaleY(1);");
        isCategoryActive = false;
    }
});

cuisineBox.addEventListener("click", () => {    
    if (isCuisineActive == false) {
        cuisineDropdown.style.display = 'block';
        cuisineArrow.setAttribute("style", "transform: scaleY(-1);");
        isCuisineActive = true;

        if (isCategoryActive == true) {
            categoryDropdown.style.display = 'none';
            categoryArrow.setAttribute("style", "transform: scaleY(1);");
            isCategoryActive = false;
        }
        else if (isSizeActive == true) {
            sizeDropdown.style.display = 'none';
            sizeArrow.setAttribute("style", "transform: scaleY(1);");
            isSizeActive = false;
        }
    }
    else {
        cuisineDropdown.style.display = 'none';
        cuisineArrow.setAttribute("style", "transform: scaleY(1);");
        isCuisineActive = false;
    }
});

sizeBox.addEventListener("click", () => {    
    if (isSizeActive == false) {
        sizeDropdown.style.display = 'block';
        sizeArrow.setAttribute("style", "transform: scaleY(-1);");
        isSizeActive = true;
        
        if (isCategoryActive == true) {
            categoryDropdown.style.display = 'none';
            categoryArrow.setAttribute("style", "transform: scaleY(1);");
            isCategoryActive = false;
        }
        else if (isCuisineActive == true) {
            cuisineDropdown.style.display = 'none';
            cuisineArrow.setAttribute("style", "transform: scaleY(1);");
            isCuisineActive = false;
        }
    }
    else {
        sizeDropdown.style.display = 'none';
        sizeArrow.setAttribute("style", "transform: scaleY(1);");
        isSizeActive = false;
    }
});

categoryFood.addEventListener("click", () => {
    assignDropdownValues('Food', categoryText);
    isCuisineVisible = true;
    isSizeVisible = true;
    itemCategory = 'F'
    cuisineBox.style.display = 'block';
    sizeBox.style.display = 'block';
});

categoryDrink.addEventListener("click", () => {
    assignDropdownValues('Drink', categoryText);
    itemCategory = 'D';
    itemCuisine = '';
    isCuisineVisible = false;
    isSizeVisible = true;
    cuisineBox.style.display = 'none';
    sizeBox.style.display = 'block';
    clearError("#invalid-cuisine-box");
});

cuisineDesi.addEventListener("click", ()=> {
    assignDropdownValues('Desi', cuisineText);
    itemCuisine = 'Desi';
});

cuisineBBQ.addEventListener("click", ()=> {
    assignDropdownValues('BBQ', cuisineText);
    itemCuisine = 'BBQ';
});

cuisineChinese.addEventListener("click", ()=> {
    assignDropdownValues('Chinese', cuisineText);
    itemCuisine = 'Chinese';
});

cuisineDessert.addEventListener("click", ()=> {
    assignDropdownValues('Dessert', cuisineText);
    itemCuisine = 'Dessert';
});

cuisineFastFood.addEventListener("click", ()=> {
    assignDropdownValues('Fast Food', cuisineText);
    itemCuisine = 'Fast Food';
});

sizeOne.addEventListener("click", () => {
    assignDropdownValues('1', sizeText);
    itemSize = 'one';
    areSizesActive = [1, 0, 0, 0];
    showSizeInputs(1);
});

sizeTwo.addEventListener("click", () => {
    assignDropdownValues('2', sizeText);
    itemSize = 'two';
    areSizesActive = [1, 1, 0, 0];
    showSizeInputs(2);
});

sizeThree.addEventListener("click", () => {
    assignDropdownValues('3', sizeText);
    itemSize = 'three';
    areSizesActive = [1, 1, 1, 0];
    showSizeInputs(3);
});

sizeFour.addEventListener("click", () => {
    assignDropdownValues('4', sizeText);
    itemSize = 'four';
    areSizesActive = [1, 1, 1, 1];
    showSizeInputs(4);
});

editButton.addEventListener("click", async () => {
    if (await checkSubmit() == true) {
        window.location.href = '/restaurant/' + restaurantID;
    }
});

checkAuthentication(restaurantID, document.body);

assignInputBoxValues();