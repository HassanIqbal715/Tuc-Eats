const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const {
    connectClient,
    getData,
    getDataByValue,
    getDataByValueArray,
    insertData,
    deleteDataByValue,
    updateDataByValue
} = require('./public/script/database.js');
require('dotenv').config(); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const lowerEmail = email.toLowerCase();

    let query1 = `SELECT pass, email FROM Administrator`;

    getData(query1, (err, admins) => {
        if (err) return res.status(500).json({ message: 'Error checking admin credentials' });

        const admin = admins.find(a => a.email.toLowerCase() === lowerEmail && a.pass === password);
        if (admin) {
            req.session.user = { email: admin.email, role: 'admin' };
            return res.json({ success: true, role: 'admin' });
        }

        query1 = `SELECT pass, email FROM Customer`;
        getData(query1, (err, users) => {
            if (err) return res.status(500).json({ message: 'Error checking user credentials' });

            const user = users.find(u => u.email.toLowerCase() === lowerEmail && u.pass === password);
            if (user) {
                req.session.user = { email: user.email, role: 'user' };
                return res.json({ success: true, role: 'user' });
            }

            res.status(401).json({ success: false, message: 'Invalid credentials' });
        });
    });
});

app.post('/api/logout', (req, res) => {
    if (req.session.user) {
        req.session.destroy();
        res.json( {message: 'Logged out successfully' });
    }
});

// Session route
app.get('/api/current-user', (req, res) => {
    if (req.session.user) {
        res.json(req.session.user);
    } else {
        res.json({ message: 'Not logged in' });
    }
});

// Restaurant

// Function placed up here to resolve a conflict.
app.get('/api/restaurant/items', (req, res) => {
    const { search } = req.query;
    if (search) {
        const query = `
            SELECT V.ID, name, item_type, restaurant_id, V.item_ID, min_price, image_link
            FROM item_variants as V, (
	        SELECT item_ID, MIN(price) as min_price 
	        FROM item_variants 
	        GROUP BY item_ID
            ) as R, Item
            WHERE Item.ID = V.item_ID AND V.price = R.min_price AND V.item_ID = R.item_ID AND name ILIKE $1;
        `;

        getDataByValueArray(query, [`%${search}%`], (err, data) => {
            if (err) 
                return res.status(500).json({ message: 'Failed to get items' });
            res.json({ data });
        });
    }
    else {
        const query = `
            SELECT V.ID, name, item_type, restaurant_id, V.item_id, min_price, image_link
            FROM item_variants as V, (
	        SELECT item_ID, MIN(price) as min_price 
	        FROM item_variants 
	        GROUP BY item_ID
            ) as R, Item
            WHERE Item.ID = V.item_ID AND V.price = R.min_price AND V.item_ID = R.item_ID;
        `;

        getData(query, (err, data) => {
            if (err) 
                return res.status(500).json({ message: 'Failed to get items' });
            res.json({ data });
        });
    }
});

app.get('/api/restaurant/items-variants/:id', (req, res) => {
    const query = `
        SELECT * FROM Item_variants WHERE item_ID = $1 ORDER BY ID;
    `;

    getDataByValue(query, req.params.id, (err, data) => {
        if (err) 
            return res.status(500).json({ message: 'Failed to get items var' });
        res.json({ data });
    });
});

app.get('/api/restaurant/items/variants/:id', (req, res) => {
    const query = `
        SELECT I.id, I.name, I.item_type, V.size, V.price, I.restaurant_id, I.image_link 
        FROM item as I, item_variants as V 
        WHERE I.id = V.item_id AND V.id = $1;
    `;

    getDataByValue(query, req.params.id, (err, data) => {
        if (err) 
            return res.status(500).json({ message: 'Failed to get items var' });
        res.json({ data });
    });
});

app.get('/api/restaurant/:id', (req, res) => {
    const query = `SELECT * FROM Restaurant WHERE ID = $1`;
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) 
            return res.status(500).json({ message: 'Failed to get restaurant data' });
        else 
            res.json({ data });
    });
});


app.get('/api/restaurant/admin/:email', (req, res) => {
    const query = `
        SELECT R.name, R.admin_id, R.id, R.description, R.image_link 
        FROM Restaurant AS R INNER JOIN Administrator AS A 
        ON R.admin_id = A.id 
        WHERE email = $1;
    `
    
    getDataByValue(query, req.params.email, (err, data) => {
        if (err) 
            return res.status(500).json({ message: 'Failed to get restaurant data' });
        else 
            res.json({ data });
    });
});

app.get('/api/restaurant/:id/items', (req, res) => {
    const query = `
    SELECT * FROM Item, (
	        SELECT item_ID, MIN(price) as price 
	        FROM item_variants 
	        GROUP BY item_ID
    ) WHERE restaurant_ID = $1 AND Item.ID = item_ID;`;

    getDataByValue(query, req.params.id, (err, data) => {
        if (err) 
            return res.status(500).json({ message: 'Failed to get items data' });
        else 
            res.json({ data });
    });
});

app.get('/api/restaurant/:id/riders', (req, res) => {
    const query = `SELECT * FROM Rider WHERE restaurant_id = $1`;
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) {
            return res.status(500).json ({ message: 'Failed to get rider data' });
        }
        else {
            res.json({ data });
        }
    })
});

app.get('/api/restaurant/:id/riders-contacts', (req, res) => {
    const query = `
                SELECT phonenumber, RP.id 
                FROM Rider_Phonenumber AS RP, Rider as R 
                WHERE RP.id = R.id AND restaurant_id = $1;
                `;
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) {
            return res.status(500).json ({ 
                message: 'Failed to get rider contact data' 
            });
        }
        else {
            res.json({ data });
        }
    })
});

app.get('/api/restaurant-contacts/:id', (req, res) => {
    const query = `SELECT phonenumber FROM Restaurant_phonenumber WHERE ID = $1`;
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to get restaurant contacts' });
        res.json({ data });
    });
});

// Item
app.get('/api/restaurant/:id/items/food', (req, res) => {
    const { id } = req.params;
    const { search } = req.query;
    if (search) {
        const query = `
            SELECT Item.ID, name, cuisine_type, item_type, price, restaurant_ID, image_link
            FROM Food, Item,(
                SELECT item_ID, MIN(price) as price 
                FROM item_variants 
                GROUP BY item_ID
            )
            WHERE Food.ID = Item.ID AND Item.ID = item_ID AND Restaurant_ID = $1 
                AND (name ILIKE $2 OR cuisine_type ILIKE $2);
        `;
        const values = [id, `%${search}%`];

        getDataByValueArray(query, values, (err, data) => {
            if (err) return res.status(500).json({ message: 'Failed to search items' });
            res.json({ data });
        });
    } else {
        const query = `
            SELECT Item.ID, name, cuisine_type, item_type, price, restaurant_ID, image_link
            FROM Food, Item,(
                SELECT item_ID, MIN(price) as price 
                FROM item_variants 
                GROUP BY item_ID
            )
            WHERE Food.ID = Item.ID AND Item.ID = item_ID AND Restaurant_ID = $1;
        `;

        getDataByValue(query, id, (err, data) => {
            if (err) return res.status(500).json({ message: 'Failed to get items' });
            res.json({ data });
        });
    }
});

app.get('/api/restaurant/:id/items/drinks', (req, res) => {
    const { id } = req.params;
    const { search } = req.query;

    if (search) {
        const query = `
            SELECT Item.id, name, item_type, price, restaurant_id, image_link 
            FROM Item, (
                SELECT item_ID, MIN(price) as price 
                FROM item_variants 
                GROUP BY item_ID
            )
            WHERE Item.id = item_ID AND item_type = 'D' AND Restaurant_ID = $1 AND name ILIKE $2;
        `;
    
        const params = [id, `%${search}%`];
        getDataByValueArray(query, params, (err, data) => {
            if (err) return res.status(500).json({ message: 'Failed to search items' });
            res.json({ data });
        });
    } else {
        const query = `
            SELECT Item.id, name, item_type, price, restaurant_id, image_link 
            FROM Item, (
                SELECT item_ID, MIN(price) as price 
                FROM item_variants 
                GROUP BY item_ID
            )
            WHERE Item.id = item_ID AND item_type = 'D' AND Restaurant_ID = $1;
        `;

        getDataByValue(query, id, (err, data) => {
            if (err) return res.status(500).json({ message: 'Failed to get items' });
            res.json({ data });
        });
    }
});

app.get('/api/restaurant/:id/items/:itemid', (req, res) => {
    const { id, itemid } = req.params;

    let query = `SELECT * FROM Item WHERE id = $1 AND restaurant_id = $2`;
    let valuesArray = [itemid, id];
    getDataByValueArray(query, valuesArray, (err, data) => {
        if (err) 
            return res.status(500).json({ message: 'Failed to get item' });
        res.json({ data });
    });
});

app.get('/api/restaurant/items/:id', (req, res) => {
    const { id } = req.params;

    let query = `SELECT * FROM Item WHERE id = $1`;
    getDataByValue(query, id, (err, data) => {
        if (err) 
            return res.status(500).json({ message: 'Failed to get item' });
        res.json({ data });
    });
});

app.post('/api/restaurant/items/insert', (req, res) => {
    const query = `
        INSERT INTO Item (id, name, item_type, restaurant_id,
            image_link) VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM Item), $1, $2, $3, $4);
    `
    const itemData = req.body;
    const valuesArray = [
        itemData.name,
        itemData.category,
        itemData.restaurant_id,
        itemData.image_link
    ];
    insertData(query, valuesArray);
    res.send("Inserted");
});
// Order
app.get('/api/restaurant/order/latest', (req, res) => {
    const query = `
        SELECT *
        FROM item_order
        WHERE order_time = (SELECT MAX(order_time) FROM item_order);
    `;
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to get orders' });
        res.json({ data });
    });
});

app.get('/api/restaurant/:id/orders', (req, res) => {
    const query = `
        SELECT *
        FROM item_order
        WHERE restaurant_id = $1
        ORDER BY id DESC;
    `;
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to get orders' });
        res.json({ data });
    });
});

app.get('/api/restaurant/order/:id/items', (req, res) => {
    const query = `
        SELECT *
        FROM order_contains
        WHERE order_id = $1;
    `;
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to get order items' });
        res.json({ data });
    });
});

app.post('/api/restaurant/:id/order/insert', (req, res) => {
    const query = `
        INSERT INTO item_order (id, order_time, order_status, customer_id, 
            restaurant_id)
        VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM item_order), 
            CURRENT_TIMESTAMP::TIMESTAMP, $1, $2, $3);
    `
    const orderData = req.body;
    const valuesArray = [
        orderData.order_status,
        orderData.customer_id,
        orderData.restaurant_id
    ];
    insertData(query, valuesArray);
    res.send("Inserted");
});

app.post('/api/restaurant/order/:id/items/insert', (req, res) => {
    const query = `
        INSERT INTO order_contains (id, item_variant_id, order_id, quantity)
        VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM order_contains), $1, $2, $3);
    `
    const itemData = req.body;
    const valuesArray = [
        itemData.itemVarID,
        itemData.order_id,
        itemData.quantity
    ];
    insertData(query, valuesArray);
    res.send("Inserted");
});

app.post('/api/restaurant/order/update-status', (req, res) => {
    const query = `
        UPDATE item_order SET order_status = $2 WHERE id = $1;
    `
    const orderData = req.body;
    const valuesArray = [
        orderData.id,
        orderData.status
    ];
    updateDataByValue(query, valuesArray);
    res.send("Updated");
});

app.post('/api/restaurant/items/variants/insert', (req, res) => {
    const id = req.params.id;
    const query = `
        INSERT INTO Item_variants (id, item_ID, size, price)
        VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM Item_variants), 
                (SELECT COALESCE(MAX(id), 0) FROM Item), $1, $2);
    `
    const itemData = req.body;
    const valuesArray = [
        itemData.size,
        itemData.price
    ];
    insertData(query, valuesArray);
    res.send("Inserted");
});

app.post('/api/restaurant/items/:id/variants/insert', (req, res) => {
    const id = req.params.id;
    const query = `
        INSERT INTO Item_variants (id, item_ID, size, price)
        VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM Item_variants), 
                $1, $2, $3);
    `
    const itemData = req.body;
    const valuesArray = [
        id,
        itemData.size,
        itemData.price
    ];
    insertData(query, valuesArray);
    res.send("Inserted");
});

app.post('/api/restaurant/items/food/insert', (req, res) => {
    const query = `
        INSERT INTO Food (ID, cuisine_type)
        VALUES ((SELECT COALESCE(MAX(id), 0) FROM Item), $1);
    `
    const itemData = req.body;
    const valuesArray = [
        itemData.cuisine,
    ];

    insertData(query, valuesArray);
    res.send("Inserted");
});

app.post('/api/restaurant/items/:id/food/insert', (req, res) => {
    const query = `
        INSERT INTO Food (ID, cuisine_type)
        VALUES ($1, $2);
    `
    const itemData = req.body;
    const valuesArray = [
        req.params.id,
        itemData.cuisine,
    ];
    
    insertData(query, valuesArray);
    res.send("Inserted");
});

app.post('/api/restaurant/items/update', (req, res) => {
    const query = `
        UPDATE Item SET name = $2, item_type = $3, image_link = $4 WHERE id = $1;
    `
    const itemData = req.body;
    const valuesArray = [
        itemData.id,
        itemData.name,
        itemData.category,
        itemData.image_link
    ];
    updateDataByValue(query, valuesArray);
    res.send("Updated");
});

app.post('/api/restaurant/items/variants/update', (req, res) => {
    const query = `
        UPDATE Item_variants SET size = $2, price = $3 WHERE ID = $1;
    `
    const itemData = req.body;
    const valuesArray = [
        itemData.id,
        itemData.size,
        itemData.price
    ];
    updateDataByValue(query, valuesArray);
    res.send("Updated");
});

app.post('/api/restaurant/items/food/update', (req, res) => {
    const query = `
        UPDATE Food SET cuisine_type = $2 WHERE id = $1;
    `
    const itemData = req.body;

    const valuesArray = [
        itemData.id,
        itemData.cuisine
    ];

    updateDataByValue(query, valuesArray);
    res.send("Updated");
});

app.post('/api/restaurant/items/delete-by-value', (req, res) => {
    const query = `
        DELETE FROM Item WHERE id = $1;
    `
    const { id } = req.body;
    let value = [id];
    deleteDataByValue(query, value);
    res.send("Deleted");
});

app.post('/api/restaurant/items/variants/delete-by-id', (req, res) => {
    const query = `
        DELETE FROM Item_variants WHERE id = $1;
    `
    const { id } = req.body;
    let value = [id];
    deleteDataByValue(query, value);
    res.send("Deleted");
});

app.post('/api/user/cart/item/delete-by-id', (req, res) => {
    const query = `
        DELETE FROM cart_item WHERE id = $1;
    `
    const { id } = req.body;
    let value = [id];
    deleteDataByValue(query, value);
    res.send("Deleted");
});

app.post('/api/user/cart/:id/item/delete', (req, res) => {
    const query = `
        DELETE FROM cart_item WHERE cart_id = $1;
    `
    const { id } = req.body;
    let value = [id];
    deleteDataByValue(query, value);
    res.send("Deleted");
});

// User
app.get('/api/user/email-and-password', (req, res) => {
    const query = `SELECT pass, email FROM Customer;`;
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to get user email and password' });
        res.json({ data });
    });
});

app.get('/api/user/data', (req, res) => {
    const email = req.query.email;
    if (email) {
        const query = `SELECT * FROM Customer WHERE Email = $1`;
        getDataByValue(query, email, (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to get user data' });
            }
            res.json({ data });
        });
    } else {
        const query = `SELECT * FROM Customer`;
        getData(query, (err, data) => {
            if (err) return res.status(500).json({ message: 'Failed to get user data' });
            res.json({ data });
        });
    }
});

app.get('/api/user/count', (req, res) => {
    const query = `SELECT count(*) AS total_users FROM Customer`;
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to get user count' });
        res.json({ count: data });
    });
});

app.get('/api/user/:id', (req, res) => {
    const query = `SELECT * FROM Customer WHERE ID = $1`;
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to get user data' });
        }
        res.json({ data });
    });
});

app.post('/insert-user', (req, res) => {
    const query = `INSERT INTO Customer (ID, username, fname, lname, 
        date_of_birth, email, pass, phonenumber, hostelnumber, roomnumber) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`;
    const values = req.body;
    const valuesArray = [
        values.id,
        values.username,
        values.fname,
        values.lname,
        values.date_of_birth,
        values.email,
        values.password,
        values.phonenumber,
        values.hostelnumber,
        values.roomnumber
    ];
    insertData(query, valuesArray);
    res.send("Inserted");
});

// Cart
app.get('/api/user/:id/cart/item', (req,res) => {
    const query = `
        SELECT Cart_item.id, cart_id, item_variant_id, quantity
        FROM Cart_Item INNER JOIN Cart 
        ON cart_id = Cart.id 
        WHERE user_id = $1;
    `
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to get cart items' });
        }
        res.json({ data });
    });
});

app.get('/api/user/:id/cart/item-count', (req,res) => {
    const query = `
        SELECT count(*) as item_Count
        FROM Cart_Item INNER JOIN Cart 
        ON cart_id = Cart.id
        GROUP BY user_id
        HAVING user_id = $1;
    `
    getDataByValue(query, req.params.id, (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to get cart items count' });
        }
        res.json({ data });
    });
});

app.post('/api/user/cart/insert', (req, res) => {
    const query = `INSERT INTO Cart (ID, USER_ID) VALUES ($1, $1)`;
    const values = req.body;
    const valuesArray = [values.id];
    insertData(query, valuesArray);
    res.send("Inserted");
});

app.post('/api/user/cart/item/insert', (req, res) => {
    const query = `INSERT INTO Cart_item (ID, Cart_ID, item_variant_id, quantity) 
        VALUES ((SELECT COALESCE(MAX(id), 0) + 1 FROM Cart_Item), $1, $2, $3);
    `;
    const values = req.body;
    const valuesArray = [values.id, values.itemVarID, values.quantity];
    insertData(query, valuesArray);
    res.send("Inserted");
});

// Admin
app.get('/api/admin/email-and-password', (req, res) => {
    const query = `SELECT pass, email FROM Administrator`;
    getData(query, (err, data) => {
        if (err) return res.status(500).json({ message: 'Failed to get admin data' });
        res.json({ data });
    });
});

app.get('/api/admin/data', (req, res) => {
    const email = req.query.email;
    if (email) {
        const query = `SELECT * FROM Administrator WHERE Email = $1`;
        getDataByValue(query, email, (err, data) => {
            if (err) {
                return res.status(500).json({ message: 'Failed to get user data' });
            }
            res.json({ data });
        });
    } else {
        const query = `SELECT * FROM Administrator`;
        getData(query, (err, data) => {
            if (err) return res.status(500).json({ message: 'Failed to get user data' });
            res.json({ data });
        });
    }
});

// Static HTML routes
app.get('/header.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'header.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/restaurant/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'restaurant.html'));
});

app.get('/restaurant/:id/riders/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'riders.html'));
});

app.get('/restaurant/:id/orders/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'orders.html'));
});

app.get('/restaurant/:id/notifications/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'notifications.html'));
});

app.get('/restaurant/:id/add-item/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'add-item.html'));
});

app.get('/restaurant/:id/edit-item/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'edit-item.html'));
});

app.get('/search', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'search.html'));
});

app.get('/item.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'item.html'));
});

app.get('/user/:id/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});
// Start server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectClient();
});