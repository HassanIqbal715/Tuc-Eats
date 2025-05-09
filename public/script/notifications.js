import * as utils from './utils.js';

const ordersContainer = document.querySelector("#orders-container");
const restaurantID = parseInt(window.location.pathname.split('/').slice(-3)[0]);

function createOrder(orderID, date, time, username, hostel, room, phone, address, price) {
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
    const rejectButton = document.createElement("div");
    const statusText = document.createElement("p");
    const receiptButton = document.createElement("div");

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

    acceptButton.textContent = 'Accept';
    rejectButton.textContent = 'Decline';
    receiptButton.textContent = 'Receipt';

    acceptButton.style.display = 'flex';
    rejectButton.style.display = 'flex';  
    receiptButton.style.display = 'flex';      

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

    let restaurant = await utils.fetchRestaurantByID(restaurantID);

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
    doc.text("Delivery Charges: Rs 50", 105, y + 10 );
    doc.text("Total: Rs " + parseInt(price + 50), 130, y + 20);

    doc.setFontSize(10);
    doc.text("Thank you for your order!", 20, y + 30);

    doc.save(`${orderID}_${name}_receipt.pdf`);
}

async function createAllOrders() {
    let orders = await utils.fetchOrdersByRestaurantID(restaurantID);

    for (let x of orders) {
        if (x.order_status != 'Pending')
            continue;
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

        createOrder(
            x.id, formattedDate, formattedTime, user.data[0].username, 
            user.data[0].hostelnumber, user.data[0].roomnumber, 
            user.data[0].phonenumber, address, totalPrice, x.order_status
        );
    }
}

createAllOrders();
utils.checkAuthentication(restaurantID, document.body);