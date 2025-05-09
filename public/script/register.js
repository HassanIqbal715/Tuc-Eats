import  { 
    fetchUser, 
    fetchUserCount,
    createError,
    clearError,
    insertCart
} from './utils.js';

const username = document.querySelector("#field-username");
const firstname = document.querySelector("#field-firstname");
const lastname = document.querySelector("#field-lastname");
const day = document.querySelector("#field-day");
const month = document.querySelector("#field-month");
const year = document.querySelector("#field-year");
const email = document.querySelector("#field-email");
const password = document.querySelector("#field-password");
const confirmPassword = document.querySelector("#field-confirmpassword");
const phoneNumber = document.querySelector("#field-phonenumber");
const hostelNumber = document.querySelector("#field-hostelnumber");
const roomNumber = document.querySelector("#field-roomnumber");

const nextButton = document.querySelector("#button-next"); 
const login = document.querySelector("#login");
const registerButton = document.querySelector("#button-register");
const backButton = document.querySelector("#button-back");

const step1 = document.querySelector("#step-1");
const step2 = document.querySelector("#step-2");

let dateOfBirth;

function checkDate() {
    if (day.value === "" || month.value === "" || year.value === "") {
        createError("Date field left empty", "#invalid-date-box");
        return false;
    }

    const dayInt = parseInt(day.value);
    const monthInt = parseInt(month.value);
    const yearInt = parseInt(year.value);

    if (
        (isNaN(dayInt) || dayInt.toString() != dayInt) ||
        (isNaN(monthInt) || monthInt.toString() != monthInt) ||
        (isNaN(yearInt) || yearInt.toString() != yearInt)
    ) {
        createError("Please enter a valid integer", "#invalid-date-box");
        return false;
    }

    const date = new Date(yearInt, monthInt - 1, dayInt);
    const current_date = new Date();
    if (
        date.getFullYear() === yearInt &&
        date.getMonth() === monthInt - 1 &&
        date.getDate() === dayInt
    ) {
        if (date > current_date) {
            createError("Future date entered", "#invalid-date-box");
            return false;
        }
        else {
            clearError("#invalid-date-box");
            dateOfBirth = date;
            return true;
        }
    }
    else {
        createError("Date out of bounds", "#invalid-date-box");
        return false;
    }
}

function checkNames() {
    if (firstname.value === "" || lastname.value === "") {
        createError("Name field left empty.", "#invalid-name-box");
        return false;
    }
    clearError("#invalid-name-box");
    return true;
}

async function checkUsername() {
    if (username.value === "") {
        createError("Username field left empty.", "#invalid-username-box");
        return false;
    }    
    
    if (username.value.length < 3) {
        createError(
            "Username must contain atleast 3 letters",
            "#invalid-username-box"
        );
        return false;
    }

    if (username.value.length > 16) {
        createError(
            "Username must contain atmost 16 letters",
            "#invalid-username-box"
        );
        return false;
    }

    if (!/^[a-zA-Z_]/.test(username.value)) {
        createError(
            "Username must start with an alphabet or '_",
            "#invalid-username-box"
        );
        return false;
    }

    let userList = await fetchUser();

    if (userList) {
        for (let x of userList) {
            if (x.username === username.value) {
                createError("User already exists.", "#invalid-username-box");
                return false;
            }
        }
    }
    else {
        console.log("Error fetching users...");
        return false;
    }

    clearError("#invalid-username-box");
    return true;
}

async function checkEmail() {
    if (email.value === "") {
        createError("Email field left empty.", "#invalid-email-box");
        return false;
    }

    if (!(email.value.includes("@") && (email.value.endsWith(".com")) || (email.value.endsWith(".pk")))) {
        createError("Invalid email format.", "#invalid-email-box");
        return false;
    }

    let userList = await fetchUser();

    if (userList) {
        for (let x of userList) {
            if (x.email.toLowerCase() === email.value.toLowerCase()) {
                createError("Email already exists.", "#invalid-email-box");
                return false;
            }
        }
    }
    else {
        console.log("Error fetching userList...");
        return false;
    }

    clearError("#invalid-email-box");
    return true;
}

function checkPassword() {
    if (password.value === "") {
        createError("Password field left empty.", "#invalid-password-box");
        return false;
    }

    if (password.value.length < 8) {
        createError(
            "Password must contain atleast 8 letters.",
            "#invalid-password-box"
        );
        return false;
    }

    if (password.value.length > 32) {
        createError(
            "Password must contain atmost 32 letters",
            "#invalid-password-box"
        );
        return false;
    }

    clearError("#invalid-password-box");
    return true;
}

function checkConfirmPassword() {
    if (confirmPassword.value === ""){
        createError("Confirm Password field left empty.", 
            "#invalid-confirmpassword");
        return false;        
    }

    if (password.value === confirmPassword.value) {
        clearError("#invalid-confirmpassword");
        return true;
    }
    else {
        createError("Passwords do not match.", "#invalid-confirmpassword");
        return false;
    }
}

async function checkValues() {
    if (
        checkNames() == true &
        checkDate() == true &
        await checkUsername() == true &
        await checkEmail() == true &
        checkPassword() == true &
        checkConfirmPassword() == true
    )
    {
        hideStep1();
        return true;
    }
    else {
        hideStep2();
        return false;
    }
}

// Step 2 checking 
async function checkPhoneNumber() {
    if (phoneNumber.value == '') {
        createError("Phonenumber field left empty", "#invalid-phonenumber-box");
        return false;
    }

    const phonenumberInt = parseInt(phoneNumber.value);

    if (isNaN(phonenumberInt) || phonenumberInt.toString() != phonenumberInt) {
        createError("Please enter a valid integer", "#invalid-phonenumber-box");
        return false;
    }

    if (phonenumberInt < 0) {
        createError("Please enter a valid phonenumber", 
            "#invalid-phonenumber-box");
        return false;
    }

    if (phoneNumber.value.length < 11 || phoneNumber.value.length > 13) {
        createError("Please enter a valid phonenumber", 
            "#invalid-phonenumber-box");
        return false;
    }

    let userList = await fetchUser();

    if (userList) {
        for (let x of userList) {
            if (x.phoneNumber === phoneNumber.value) {
                createError("Phonenumber already exists.", 
                    "#invalid-phonenumber-box");
                return false;
            }
        }
        clearError("#invalid-phonenumber-box");
        return true;
    }
    else {
        console.error("Userlist could not be fetched");
    }
    return false;
}

function checkHostel() {
    if (hostelNumber.value == '') {
        createError("Hostel # field left empty", "#invalid-hostel-box");
        return false;
    }

    let hostelInt = parseInt(hostelNumber.value);

    if (isNaN(hostelInt) || hostelInt.toString() != hostelInt) {
        createError("Please enter a valid integer", "#invalid-hostel-box");
        return false;
    }

    if (hostelInt < 0 || hostelInt > 13) {
        createError("Please enter a valid hostel", "#invalid-hostel-box");
        return false;
    }

    clearError("#invalid-hostel-box");
    return true;
}

function checkRoom() {
    if (roomNumber.value == '') {
        createError("Room # field left empty", "#invalid-room-box");
        return false;
    }
    clearError("#invalid-room-box");
    return true;
}

async function checkStep2() {
    if (
        await checkValues() == true &
        await checkPhoneNumber() == true &
        checkHostel() == true &
        checkRoom() == true
    ) {
        let user_ID = await fetchUserCount();
        const newCustomer = {
            id: parseInt(user_ID[0].total_users) + 1,
            username: username.value,
            fname: firstname.value,
            lname: lastname.value,
            date_of_birth: dateOfBirth,
            email: email.value,
            password: password.value,
            phonenumber: phoneNumber.value,
            hostelnumber: parseInt(hostelNumber.value),
            roomnumber: roomNumber.value
        };
        await insertCustomer(newCustomer);
        await insertCart(newCustomer.id);
        window.location.href = '/';
    }
}

async function insertCustomer(customerData) {
    const response = await fetch('/insert-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(customerData),
    });
}

// Hiding steps 1 and 2
function hideStep1() {
    step1.style.display = 'none';
    step2.style.display = 'block';
}

function hideStep2() {
    step1.style.display = 'block';
    step2.style.display = 'none';
}

nextButton.addEventListener("click", checkValues);
login.addEventListener("click", () => {
    window.location.href = '/login/';
})
registerButton.addEventListener("click", checkStep2);
backButton.addEventListener("click", hideStep2);
hideStep2();