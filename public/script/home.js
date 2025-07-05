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

createRestaurantItem('Ayan Gardens', '/images/ayan_gardens.jpg');
createRestaurantItem('Hot\'N\'Spicy', '/images/hot_n_spicy.jpg');
createRestaurantItem('Raju Campus Hotel', '/images/campus_hotel.jpg');
createRestaurantItem('Asrar Bucks', '/images/asrar_bucks.jpg');
createRestaurantItem('Abid Hortons', '/images/abid_hortons.jpg');