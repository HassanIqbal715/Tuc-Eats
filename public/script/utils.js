export async function fetchRestaurantByID(id) {
    try {
        const response = await fetch(`/api/restaurant/${id}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching restaurant data:', error);
        return null;
    }
}

export async function fetchRestaurantByEmail(email) {
    try {
        const response = await fetch(`/api/restaurant/admin/${email}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching restaurant data:', error);
        return null;
    }
}

export async function fetchRestaurantContactsByID(id) {
    try {
        const response = await fetch(`/api/restaurant-contacts/${id}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching restaurant phonenumbers:', error);
        return null;
    }
}

export async function fetchFoodByRestaurantID(id) {
    try {
        const response = await fetch(`/api/restaurant/${id}/items/food`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching food:', error);
        return null;
    }    
}

export async function fetchDrinksByRestaurantID(id) {
    try {
        const response = await fetch(`/api/restaurant/${id}/items/drinks`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching drinks:', error);
        return null;
    }    
}

export async function fetchItemsByRestaurantID(id) {
    try {
        const response = await fetch(`/api/restaurant/${id}/items`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching items:', error);
        return null;
    }    
}

export async function fetchItemsByName(name) {
    try {
        const response = await fetch(`/api/restaurant/items?search=${encodeURIComponent(name)}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching items:', error);
        return null;
    }    
}

// Cart
export async function fetchCartItemsByUserID(id) {
    try {
        const response = await fetch(`/api/user/${id}/cart/item`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching cart items:', error);
        return null;
    }    
}

export async function fetchCartItemsCountByUserID(id) {
    try {
        const response = await fetch(`/api/user/${id}/cart/item-count`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching cart items count:', error);
        return null;
    }    
}

export async function fetchSearchRestaurantFoodByName(id, name) {
    try {
        const response = await fetch(`/api/restaurant/${id}/items/food?search=${encodeURIComponent(name)}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching food:', error);
        return null;
    }    
}

export async function fetchSearchRestaurantDrinksByName(id, name) {
    try {
        const response = await fetch(`/api/items/drinks/${id}?search=${encodeURIComponent(name)}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching drinks:', error);
        return null;
    }    
}

export async function fetchRidersByRestaurantId(id) {
    try {
        const response = await fetch(`/api/restaurant/${id}/riders`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching riders:', error);
        return null;
    }    
}

export async function fetchRiderContactsByRestaurantId(id) {
    try {
        const response = await fetch(`/api/restaurant/${id}/riders-contacts`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching riders:', error);
        return null;
    }    
}

export async function fetchAdminEmailsAndPasswords() {
    try {
        const response = await fetch('/api/admin/email-and-password');
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching admin email and password:', error);
        return null;
    }
}

export async function fetchUserEmailsAndPasswords() {
    try {
        const response = await fetch('/api/user/email-and-password');
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching user email and password:', error);
        return null;
    }
}

export async function fetchUser() {
    try {
        const response = await fetch('/api/user/data');
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export async function fetchUserByEmail(email) {
    try {
        const response = await fetch(`/api/user/data?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        return data.data;    
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }
}

export async function fetchAdminByEmail(email) {
    try {
        const response = await fetch(`/api/admin/data?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        return data.data;    
    }
    catch (error) {
        console.error('Error fetching admin data:', error);
        return null;
    }
}

export async function fetchUserCount() {
    try {
        const response = await fetch('/api/user/count');
        const data = await response.json();
        return data.count;
    }
    catch (error) {
        console.error('Error fetching user count:', error);
        return null;
    }    
}

export async function fetchUserByID(id) {
    try {
        const response = await fetch(`/api/user/${id}`);
        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        return null;
    }  
}

export async function fetchLatestOrder() {
    try {
        const response = await fetch(`/api/restaurant/order/latest`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching latest order:', error);
        return null;
    }    
}

export async function fetchOrdersByRestaurantID(id) {
    try {
        const response = await fetch(`/api/restaurant/${id}/orders`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching restaurant orders:', error);
        return null;
    }        
}

export async function fetchOrdersByUserID(id) {
    try {
        const response = await fetch(`/api/user/${id}/orders`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching user orders:', error);
        return null;
    }        
}

export async function fetchOrderItemsByOrderID(id) {
    try {
        const response = await fetch(`/api/restaurant/order/${id}/items`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching order items:', error);
        return null;
    }        
}

export function createError(text, target) {
    let erro = document.createElement("p");
    erro.classList.add("invalid-input");
    erro.textContent = text;
    erro.setAttribute("style", "margin-top: 0; margin-bottom: 0;");
    const box = document.querySelector(target);
    box.innerHTML = '';
    box.appendChild(erro);
}

export function clearError(target) {
    const erro = document.querySelector(target);
    erro.innerHTML = '';
}

export async function insertItem(itemData) {
    const response = await fetch('/api/restaurant/items/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function insertDrink(itemData) {
    const response = await fetch('/api/restaurant/items/drinks/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function insertFood(itemData) {
    const response = await fetch('/api/restaurant/items/food/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function insertFoodByID(id, itemData) {
    const response = await fetch(`/api/restaurant/items/${id}/food/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function insertVariant(itemData) {
    const response = await fetch('/api/restaurant/items/variants/insert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function insertVariantByItemID(id, itemData) {
    const response = await fetch(`/api/restaurant/items/${id}/variants/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function insertCart(id) {
    const response = await fetch(`/api/user/cart/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify( {id} ),
    });
}

export async function insertCartItem(itemData) {
    const response = await fetch(`/api/user/cart/item/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function insertOrder(orderData) {
    const response = await fetch(`/api/restaurant/${orderData.restaurant_id}/order/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
}

export async function insertOrderItem(itemData) {
    const response = await fetch(`/api/restaurant/order/${itemData.order_id}/items/insert`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function updateItem(itemData) {
    const response = await fetch('/api/restaurant/items/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function updateItemVariant(itemData) {
    const response = await fetch('/api/restaurant/items/variants/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function updateDrink(itemData) {
    const response = await fetch('/api/restaurant/items/drinks/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function updateFood(itemData) {
    const response = await fetch('/api/restaurant/items/food/update', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
    });
}

export async function updateOrderStatusByID(orderData) {
    const response = await fetch(`/api/restaurant/order/update-status`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });
}

export async function deleteItemByID(id) {
    const response = await fetch('/api/restaurant/items/delete-by-value', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
}

export async function deleteItemVariantByID(id) {
    const response = await fetch('/api/restaurant/items/variants/delete-by-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
}

export async function deleteCartItemByID(id) {
    const response = await fetch('/api/user/cart/item/delete-by-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
}

export async function deleteCartItemsByCartID(id) {
    const response = await fetch(`/api/user/cart/${id}/item/delete`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });
}

export async function getCurrentUser() {
    const response = await fetch('/api/current-user');
    return await response.json();
}

export async function checkAuthentication(restaurantID, body) {
    let currentAdmin = await getCurrentUser();
    if (currentAdmin) {
        if (currentAdmin.role === 'admin') {
            let admin = await fetchAdminByEmail(currentAdmin.email);
            if (admin[0].id == restaurantID) {
                body.style.display = 'block';
            }
        }
    }
    return;
}

export async function checkAuthenticationWithType(restaurantID, body, type) {
    let currentAdmin = await getCurrentUser();
    if (currentAdmin) {
        if (currentAdmin.role === 'admin') {
            let admin = await fetchAdminByEmail(currentAdmin.email);
            if (admin[0].id == restaurantID) {
                body.style.display = type;
            }
        }
    }
    return;
}

export async function fetchCurrentUser() {
    let currentUser = await getCurrentUser();
    if (currentUser) {
        if (currentUser.role === 'user') {
            let user = await fetchUserByEmail(currentUser.email);
            return user;
        }
    }
    return null;
}

export async function checkUserAuthentication() {
    let currentUser = await getCurrentUser();
    if (currentUser) {
        if (currentUser.role === 'user') {
            return true;
        }
    }
    return false;
}

export async function fetchItemsByRestaurantIDAndItemID(id,itemID) {
    try {
        const response = await fetch(`/api/restaurant/${id}/items/${itemID}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching items:', error);
        return null;
    }    
}

export async function fetchItemsByItemID(id) {
    try {
        const response = await fetch(`/api/restaurant/items/${id}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching items:', error);
        return null;
    }    
}

export async function fetchItemVariantsByItemID(id) {
    try {
        const response = await fetch(`/api/restaurant/items-variants/${id}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching items:', error);
        return null;
    }        
}

export async function fetchItemByVariantID(id) {
    try {
        const response = await fetch(`/api/restaurant/items/variants/${id}`);
        const data = await response.json();
        return data.data;
    }
    catch (error) {
        console.error('Error fetching items:', error);
        return null;
    }        
}