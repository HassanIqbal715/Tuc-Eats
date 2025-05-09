import { 
    fetchRiderContactsByRestaurantId,
    fetchRidersByRestaurantId,
    checkAuthentication
 } from "./utils.js";

let restaurantID = parseInt(window.location.pathname.split('/').slice(-3)[0]);
let ridersContainer = document.querySelector("#riders-container");
let backButton = document.querySelector("#riders-back-button");

function createRider(name, id, phonenumbers, image_link) {
    let rider = document.createElement('div');
    let rider_image = document.createElement ('img');
    let rider_name = document.createElement ('span');
    let rider_contact_box = document.createElement ('div');

    rider.classList.add('rider');
    rider_image.classList.add('rider-image');
    rider_name.classList.add('rider-name');
    rider_contact_box.classList.add('rider-contact-box');

    rider_image.src = image_link;
    rider_name.textContent = name;

    for (let x of phonenumbers) {
        if (x.id == id) {
            let rider_contact = document.createElement('span');
            rider_contact.textContent = x.phonenumber;
            rider_contact_box.appendChild(rider_contact);
        }
    }
    rider.appendChild(rider_image);
    rider.appendChild(rider_name);
    rider.appendChild(rider_contact_box);
    ridersContainer.appendChild(rider);
}

const riders = await fetchRidersByRestaurantId(restaurantID);
const phonenumbers = await fetchRiderContactsByRestaurantId(restaurantID);

for (let x of riders) {
    createRider(x.name, x.id, phonenumbers, x.image_link);
}

backButton.addEventListener("click", () => {
    window.location.href = '/restaurant/' + restaurantID;
});

checkAuthentication(restaurantID, document.body);