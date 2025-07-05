import { 
    fetchUserByEmail, 
    fetchAdminByEmail, 
    fetchRestaurantByEmail,
    checkUserAuthentication, 
    fetchCurrentUser,
    fetchCartItemsCountByUserID,
    fetchOrdersByRestaurantID
} from './utils.js';

const headerButtons = document.querySelector("#header-buttons");

const userList = document.querySelector("#user-list");
const adminList = document.querySelector("#admin-list");
const userDropdown = document.querySelector("#user-dropdown");
const adminDropdown = document.querySelector("#admin-dropdown");

const userLogOutButton = document.querySelector("#user-logout-button");
const userOrderButton = document.querySelector("#user-myOrders");
const adminLogOutButton = document.querySelector("#admin-logout-button");

const adminMyRestaurantButton = document.querySelector("#admin-myRestaurant");
const adminRidersButton = document.querySelector("#admin-myRiders");
const adminOrdersButton = document.querySelector("#admin-myOrders");

const searchButton = document.querySelector("#header-search-button");
const searchBar = document.querySelector("#header-search-bar");

const cartButton = document.querySelector("#header-cart-icon");
const cartText = document.querySelector("#header-cart-text");

const notificationButton = document.querySelector("#header-notification-icon");
const notificationText = document.querySelector("#header-notification-text");

let currentUser;

async function getCurrentUser() {
    const response = await fetch('/api/current-user');
    currentUser = await response.json();
}

async function checkUserLogin() {
    if (await checkUserAuthentication() == true) {
        document.querySelector("#header-cart-container").style.display = 'flex';
        initializeCart();
    }
}

async function checkLogin() {
    await getCurrentUser();
    if (currentUser.role === 'user') {
        headerButtons.style.display = 'none';
        adminList.style.display = 'none';
        userList.style.display = 'block';
        return 1;
    }
    else if (currentUser.role === 'admin') {
        headerButtons.style.display = 'none';
        adminList.style.display = 'block';
        userList.style.display = 'none';
        document.querySelector("#header-notification-container").style.display = 'flex';
        await initializeNotifications();
        return 2;
    }
    else {
        headerButtons.style.display = 'flex';
        adminList.style.display = 'none';
        userList.style.display = 'none';
        return 0;
    }
}

async function initializeCart() {
    let user = await fetchCurrentUser();
    let itemCount = await fetchCartItemsCountByUserID(user[0].id);
    if (itemCount && itemCount.length > 0)
        cartText.textContent = itemCount[0].item_count;
}

async function initializeNotifications() {
    let restaurant = await fetchRestaurantByEmail(currentUser.email);
    let orders = await fetchOrdersByRestaurantID(restaurant[0].id);
    let count = 0;
    if (orders && orders.length > 0) {
        for (let x of orders) {
            if (x.order_status == 'Pending') {
                count++;
            }
        }
    }
    notificationText.textContent = count;
}

async function assignUsername() {
    if (await checkLogin() == 1) {
        let currentUsername = await fetchUserByEmail(currentUser.email);
        const userName = document.querySelector("#user-name");
        userName.textContent = currentUsername[0].username;
    }
    else if (await checkLogin() == 2) {
        let currentUsername = await fetchAdminByEmail(currentUser.email);
        const adminName = document.querySelector("#admin-name");
        adminName.textContent = currentUsername[0].name;
    }
}

async function logout() {
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        const data = await response.json();
        
        if (response.ok) {
            window.location.href = '/';
        } else {
            console.error('Error logging out:', data.message);
        }
    } catch (error) {
        console.error('Logout request failed:', error);
    }
}

function clickSearch() {
    let searchTerm = searchBar.value.trim();
    if (searchTerm != '') {
        window.location.href = `/search?name=${searchTerm}`;
    }
}

async function clickMyRestaurant() {
    if (!currentUser)
        await getCurrentUser();
    let restaurantData = await fetchRestaurantByEmail(currentUser.email);

    window.location.href = `/restaurant/${restaurantData[0].id}`;
}

async function clickRiders() {
    if (!currentUser)
        await getCurrentUser();
    let restaurantData = await fetchRestaurantByEmail(currentUser.email);

    window.location.href = `/restaurant/${restaurantData[0].id}/riders/`;
}

async function clickOrders() {
    if (!currentUser)
        await getCurrentUser();
    let restaurantData = await fetchRestaurantByEmail(currentUser.email);

    window.location.href = `/restaurant/${restaurantData[0].id}/orders/`;
}

assignUsername();

userList.addEventListener("mouseover", ()=> {
    userDropdown.style.display = 'block';
});

userList.addEventListener("mouseleave", ()=> {
    userDropdown.style.display = 'none';
});

adminList.addEventListener("mouseover", ()=> {
    adminDropdown.style.display = 'block';
});

adminList.addEventListener("mouseleave", ()=> {
    adminDropdown.style.display = 'none';
});

adminLogOutButton.addEventListener("click", logout);
userLogOutButton.addEventListener("click", logout);

searchButton.addEventListener("click", clickSearch);

searchBar.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const searchTerm = searchBar.value.trim();
        if (searchTerm) {
            window.location.href = `/search?name=${encodeURIComponent(searchTerm)}`;
        }
    }
});

userOrderButton.addEventListener("click", async () => {
    if (!currentUser)
        await getCurrentUser();
    let userData = await fetchUserByEmail(currentUser.email);

    window.location.href = `/user/${userData[0].id}/orders/`;
});

adminMyRestaurantButton.addEventListener("click", async ()=> {
    await clickMyRestaurant();
});

adminRidersButton.addEventListener("click", clickRiders);

adminOrdersButton.addEventListener("click", clickOrders);

cartButton.addEventListener("click", async () => {
    let user = await fetchCurrentUser();
    if (user) {
        window.location.href = `/user/${user[0].id}/cart`;
    }
});

notificationButton.addEventListener("click", async() => {
    if (!currentUser)
        await getCurrentUser();
    let restaurantData = await fetchRestaurantByEmail(currentUser.email);

    window.location.href = `/restaurant/${restaurantData[0].id}/notifications/`;    
});

checkUserLogin();
