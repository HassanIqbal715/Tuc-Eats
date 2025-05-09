const restaurantContainer = document.querySelector("#restaurant-grid");
restaurantContainer.classList.add("restaurant-grid");
let restaurantCounter = 0;

function createRestaurantItem(name, imageLink) {
    const restaurantItem = document.createElement("div");
    const restaurantItemImage = document.createElement("img");
    const restaurantItemName = document.createElement("div");
    const restaurantItemText = document.createElement("p");

    restaurantItem.classList.add("restaurant-item");
    restaurantItemImage.classList.add("restaurant-item-image");
    restaurantItemName.classList.add("restaurant-item-name");
    restaurantItemText.classList.add("restaurant-item-text");

    restaurantItemImage.src = imageLink;
    restaurantItemText.textContent = name;
    restaurantItem.id = ++restaurantCounter;

    restaurantItem.addEventListener("click", () => {
        console.log(restaurantItem.id);
        clickRestaurant(restaurantItem.id);
    });

    restaurantItem.appendChild(restaurantItemImage);
    restaurantItem.appendChild(restaurantItemName);
    restaurantItemName.appendChild(restaurantItemText);
    restaurantContainer.appendChild(restaurantItem);
}

function clickRestaurant(id) {
    window.location.href = `/restaurant/${id}`;
}

createRestaurantItem('Ayan Gardens', '/images/ayan-gardens.jpg');
createRestaurantItem('Hot\'N\'Spicy', '/images/ayan-gardens.jpg');
createRestaurantItem('Raju Campus Hotel', '/images/ayan-gardens.jpg');
createRestaurantItem('Asrar Bucks', '/images/ayan-gardens.jpg');
createRestaurantItem('Abid Hortons', '/images/ayan-gardens.jpg');