import * as utils from './utils.js';

const ordersContainer = document.querySelector("#orders-container");

let ID = parseInt(window.location.pathname.split('/').slice(-3)[0]);
async function userAuthentication() {
    let currentUser = await utils.fetchCurrentUser();
    if (await utils.checkUserAuthentication()) {
        if (currentUser) {
            if (currentUser[0].id == ID) {
                document.body.style.display = 'block';
                createAllUserOrders();
                return true;
            }
        }
    }
    else {
        utils.checkAuthentication(ID, document.body);
        createAllAdminOrders();
    }
    return false;
}

async function createAdminOrder(orderID, date, time, username, hostel, room, phone, address, price, status) {
    const orderBox = document.createElement("div");
    const orderIDBox = document.createElement("div");  
    const orderIDText = document.createElement("p");
    const orderDateBox = document.createElement("div");
    const orderUserBox = document.createElement("div");
    const orderDestinationBox = document.createElement("div");
    const orderPriceBox = document.createElement("div");
    const orderPriceText = document.createElement("div");
    const orderPriceRs = document.createElement("div");
    const orderPrice = document.createElement("div");
    const buttonsBox = document.createElement("div");
    const acceptButton = document.createElement("div");
    const deliveredButton = document.createElement("div");
    const rejectButton = document.createElement("div");
    const receiptButton = document.createElement("div");
    const statusText = document.createElement("p");

    orderBox.classList.add("order-box");
    orderIDBox.classList.add("order-id-box");
    orderIDText.classList.add("order-id-text");
    orderDateBox.classList.add("order-date-box");
    orderUserBox.classList.add("order-user-box");
    orderDestinationBox.classList.add("order-destination-box");
    orderPriceBox.classList.add("order-price-box");
    orderPriceRs.classList.add("order-price-rs");
    orderPrice.classList.add("order-price");
    buttonsBox.classList.add("buttons-box");
    statusText.classList.add("status-text");
    acceptButton.classList.add("receipt-button");
    rejectButton.classList.add("receipt-button");
    receiptButton.classList.add("receipt-button");
    deliveredButton.classList.add("receipt-button");

    acceptButton.textContent = 'Accept';
    rejectButton.textContent = 'Decline';
    receiptButton.textContent = 'Receipt';
    deliveredButton.textContent = 'Delivered';

    if (status == 'Cancelled') {
        statusText.textContent = 'Cancelled';
    }
    else if (status == 'Pending') {
        acceptButton.style.display = 'flex';
        rejectButton.style.display = 'flex';
        statusText.textContent = 'Pending';
    }
    else if (status == 'Preparing') {
        deliveredButton.style.display = 'flex';
        rejectButton.style.display = 'flex';
        receiptButton.style.display = 'flex';
        statusText.textContent = 'Preparing';
        rejectButton.textContent = 'Cancel';
    }
    else {
        statusText.textContent = 'Delivered';
        receiptButton.style.display = 'flex';
    }

    orderIDText.textContent = 'Order ID: ' + orderID;
    orderDateBox.innerHTML = `Date: ${date} <br>Time: ${time}`;

    orderUserBox.innerHTML = `
        Ordered By: ${username} <br>Hostel: ${hostel} 
        <br>Room: ${room} <br>Phone Number: ${phone}
    `;

    orderDestinationBox.textContent = 'Address: ' + address;
    orderPriceText.textContent = 'Total: ';
    orderPriceRs.textContent = 'Rs';
    orderPrice.textContent = price;

    receiptButton.addEventListener("click", async () => {
        let orderItems = await utils.fetchOrderItemsByOrderID(orderID);
        let allItems = [];
        let totalPrice = 0;
        for (let x of orderItems) {
            let item = await utils.fetchItemByVariantID(x.item_variant_id);
            let size = '';
            if (item[0].size != 'None') {
                size = item[0].size;
            }
            let itemUnit = {
                name: item[0].name, 
                size: size,
                quantity: x.quantity, 
                price: item[0].price * x.quantity
            };
            totalPrice += (item[0].price * x.quantity);
            allItems.push(itemUnit);
        }
        await generateReceipt(
            orderID, date, time, username, phone, address, totalPrice, allItems
        );
    });

    deliveredButton.addEventListener("click", async () => {
        const orderData = {
            id: orderID,
            status: 'Delivered'
        };

        await utils.updateOrderStatusByID(orderData);
        window.location.reload();
    });

    acceptButton.addEventListener("click", async () => {
        const orderData = {
            id: orderID,
            status: 'Preparing'
        };

        await utils.updateOrderStatusByID(orderData);
        window.location.reload();
    });

    rejectButton.addEventListener("click", async () => {
        const orderData = {
            id: orderID,
            status: 'Cancelled'
        };

        await utils.updateOrderStatusByID(orderData);
        window.location.reload();
    });

    orderIDBox.appendChild(orderIDText);
    orderPriceBox.appendChild(orderPriceText);
    orderPriceBox.appendChild(orderPriceRs);
    orderPriceBox.appendChild(orderPrice);

    buttonsBox.appendChild(statusText);
    buttonsBox.appendChild(acceptButton);
    buttonsBox.appendChild(deliveredButton);
    buttonsBox.appendChild(rejectButton);
    buttonsBox.appendChild(receiptButton);

    orderBox.appendChild(orderIDBox);
    orderBox.appendChild(orderDateBox);
    orderBox.appendChild(orderUserBox);
    orderBox.appendChild(orderDestinationBox);
    orderBox.appendChild(orderPriceBox);
    orderBox.appendChild(buttonsBox);

    ordersContainer.appendChild(orderBox);
}


async function createUserOrder(
    orderID, date, time, username, hostel, room, phone, address, price, status,
    restaurantName
) {
    const orderBox = document.createElement("div");
    const orderIDBox = document.createElement("div");  
    const orderIDText = document.createElement("p");
    const orderDateBox = document.createElement("div");
    const orderUserBox = document.createElement("div");
    const orderDestinationBox = document.createElement("div");
    const orderPriceBox = document.createElement("div");
    const orderPriceText = document.createElement("div");
    const orderPriceRs = document.createElement("div");
    const orderPrice = document.createElement("div");
    const buttonsBox = document.createElement("div");
    const acceptButton = document.createElement("div");
    const deliveredButton = document.createElement("div");
    const rejectButton = document.createElement("div");
    const receiptButton = document.createElement("div");
    const statusText = document.createElement("p");

    orderBox.classList.add("order-box");
    orderIDBox.classList.add("order-id-box");
    orderIDText.classList.add("order-id-text");
    orderDateBox.classList.add("order-date-box");
    orderUserBox.classList.add("order-user-box");
    orderDestinationBox.classList.add("order-destination-box");
    orderPriceBox.classList.add("order-price-box");
    orderPriceRs.classList.add("order-price-rs");
    orderPrice.classList.add("order-price");
    buttonsBox.classList.add("buttons-box");
    statusText.classList.add("status-text");
    receiptButton.classList.add("receipt-button");

    receiptButton.textContent = 'Receipt';

    if (status == 'Cancelled') {
        statusText.textContent = 'Cancelled';
    }
    else if (status == 'Pending') {
        statusText.textContent = 'Pending';
    }
    else if (status == 'Preparing') {
        receiptButton.style.display = 'flex';
        statusText.textContent = 'Preparing';
    }
    else {
        statusText.textContent = 'Delivered';
        receiptButton.style.display = 'flex';
    }

    orderIDText.textContent = 'Order ID: ' + orderID;
    orderDateBox.innerHTML = `Date: ${date} <br>Time: ${time}`;

    orderUserBox.innerHTML = `
        Ordered By: ${username} <br>Hostel: ${hostel} 
        <br>Room: ${room} <br>Phone Number: ${phone}
    `;

    orderDestinationBox.textContent = 'Address: ' + address + '\n' + 'Restaurant: ' + restaurantName;
    orderPriceText.textContent = 'Total: ';
    orderPriceRs.textContent = 'Rs';
    orderPrice.textContent = price;

    receiptButton.addEventListener("click", async () => {
        let orderItems = await utils.fetchOrderItemsByOrderID(orderID);
        let allItems = [];
        let totalPrice = 0;
        for (let x of orderItems) {
            let item = await utils.fetchItemByVariantID(x.item_variant_id);
            let size = '';
            if (item[0].size != 'None') {
                size = item[0].size;
            }
            let itemUnit = {
                name: item[0].name, 
                size: size,
                quantity: x.quantity, 
                price: item[0].price * x.quantity
            };
            totalPrice += (item[0].price * x.quantity);
            allItems.push(itemUnit);
        }
        await generateReceipt(
            orderID, date, time, username, phone, address, totalPrice, allItems
        );
    });

    deliveredButton.addEventListener("click", async () => {
        const orderData = {
            id: orderID,
            status: 'Delivered'
        };

        await utils.updateOrderStatusByID(orderData);
        window.location.reload();
    });

    acceptButton.addEventListener("click", async () => {
        const orderData = {
            id: orderID,
            status: 'Preparing'
        };

        await utils.updateOrderStatusByID(orderData);
        window.location.reload();
    });

    rejectButton.addEventListener("click", async () => {
        const orderData = {
            id: orderID,
            status: 'Cancelled'
        };

        await utils.updateOrderStatusByID(orderData);
        window.location.reload();
    });

    orderIDBox.appendChild(orderIDText);
    orderPriceBox.appendChild(orderPriceText);
    orderPriceBox.appendChild(orderPriceRs);
    orderPriceBox.appendChild(orderPrice);

    buttonsBox.appendChild(statusText);
    buttonsBox.appendChild(acceptButton);
    buttonsBox.appendChild(deliveredButton);
    buttonsBox.appendChild(rejectButton);
    buttonsBox.appendChild(receiptButton);

    orderBox.appendChild(orderIDBox);
    orderBox.appendChild(orderDateBox);
    orderBox.appendChild(orderUserBox);
    orderBox.appendChild(orderDestinationBox);
    orderBox.appendChild(orderPriceBox);
    orderBox.appendChild(buttonsBox);

    ordersContainer.appendChild(orderBox);
}

async function generateReceipt(orderID, date, time, name, phone, address, price, items) {
    const doc = new jsPDF();

    let restaurant = await utils.fetchRestaurantByID(ID);

    doc.setFontSize(18);
    doc.text("Order Receipt", 80, 20);

    doc.setFontSize(12);
    doc.text("Order Number: " + orderID, 20, 30);
    doc.text("Restaurant Name: " + restaurant[0].name, 20, 40);
    doc.text("Customer: " + name, 20, 50);
    doc.text("Phone Number: " + phone, 20, 60);
    doc.text("Date: " + date, 20, 70);
    doc.text("Time: " + time, 20, 80);
    doc.text("Delivery Address: " + address, 20, 90);

    doc.setFont("Helvetica", "bold");
    doc.text("Item", 20, 100);
    doc.text("Qty", 90, 100);
    doc.text("Price", 130, 100);
    doc.setFont("Helvetica", "normal");

    let y = 110;
    let total = 0;

    items.forEach(item => {
        doc.text(item.size + ' ' + item.name, 20, y);
        doc.text(String(item.quantity), 90, y);
        doc.text("Rs " + item.price, 130, y);
        total += item.price;
        y += 10;
    });

    doc.setFont("Helvetica", "bold");
    doc.text("Total: Rs " + price, 130, y + 10);

    doc.setFontSize(10);
    doc.text("Thank you for your order!", 20, y + 30);

    doc.save(`${orderID}_${name}_receipt.pdf`);
}

async function createAllAdminOrders() {
    let orders = await utils.fetchOrdersByRestaurantID(ID);

    for (let x of orders) {
        let orderItems = await utils.fetchOrderItemsByOrderID(x.id);
        let user = await utils.fetchUserByID(x.customer_id);
        let totalPrice = 0;

        const date = new Date(x.order_time);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;

        for (let y of orderItems) {
            let itemVariant = await utils.fetchItemByVariantID(y.item_variant_id);
            totalPrice += (itemVariant[0].price * y.quantity);
        }

        let address = 'Hostel: ' + user.data[0].hostelnumber + ' Room: ' 
            + user.data[0].roomnumber;

        createAdminOrder(
            x.id, formattedDate, formattedTime, user.data[0].username, 
            user.data[0].hostelnumber, user.data[0].roomnumber, 
            user.data[0].phonenumber, address, totalPrice, x.order_status
        );
    }
}

async function createAllUserOrders() {
    let orders = await utils.fetchOrdersByUserID(ID);

    for (let x of orders) {
        let orderItems = await utils.fetchOrderItemsByOrderID(x.id);
        let user = await utils.fetchUserByID(x.customer_id);
        let restaurantDetails = await utils.fetchRestaurantByID(x.restaurant_id);
        let totalPrice = 0;

        const date = new Date(x.order_time);

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;

        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedTime = `${hours}:${minutes} ${ampm}`;

        for (let y of orderItems) {
            let itemVariant = await utils.fetchItemByVariantID(y.item_variant_id);
            totalPrice += (itemVariant[0].price * y.quantity);
        }

        let address = 'Hostel: ' + user.data[0].hostelnumber + ' Room: ' 
            + user.data[0].roomnumber;

        createUserOrder(
            x.id, formattedDate, formattedTime, user.data[0].username, 
            user.data[0].hostelnumber, user.data[0].roomnumber, 
            user.data[0].phonenumber, address, totalPrice, x.order_status,
            restaurantDetails[0].name
        );
    }
}

userAuthentication();