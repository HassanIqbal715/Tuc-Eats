function createCredentialsError() {
    let invalidEmail = document.createElement("p");
    invalidEmail.classList.add("invalid-input");
    invalidEmail.textContent = "Incorrect or invalid login credentials.";
    invalidInputBox.appendChild(invalidEmail);
}

async function loginClick() {
    let email = emailField.value.toLowerCase();
    let password = passwordField.value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    });

    invalidInputBox.innerHTML = '';

    if (response.ok) {
        const result = await response.json();
        window.location.href = '/';
    } else {
        createCredentialsError();
    }
}

function registerClick() {
    window.location.href = '/register/';
}

const loginFields = document.querySelector("#login-box-fields");
const buttons = document.querySelector("#login-box-buttons");
const invalidInputBox = document.querySelector("#invalid-input-box");

let emailFieldBox = document.createElement("div");
let passwordFieldBox = document.createElement("div");

let emailField = document.createElement("input");
let passwordField = document.createElement("input");
let forgotPasswordButton = document.createElement("p");
let loginButton = document.createElement("div");
let registerButton = document.createElement("div");

emailFieldBox.classList.add("fieldBox");
passwordFieldBox.classList.add("fieldBox");
passwordFieldBox.style.marginTop = "9.229vh";

emailField.placeholder = " Email";
emailField.classList.add("field");
emailField.addEventListener("keydown", (event)=> {    
    if (event.key === "Enter") {
        loginClick();
    }
});

passwordField.placeholder = " Password";
passwordField.classList.add("field");
passwordField.style.marginTop = "4.644vh";
passwordField.type = "password";
passwordField.addEventListener("keydown", (event)=> {    
    if (event.key === "Enter") {
        loginClick();
    }
});

forgotPasswordButton.classList.add("forgotPassword");
forgotPasswordButton.textContent = "Forgot password?";

loginButton.classList.add("button");
loginButton.textContent = "Login";
loginButton.addEventListener("click", loginClick);

registerButton.classList.add("button");
registerButton.textContent = "Register";
registerButton.style.marginTop = "2.5vh";
registerButton.addEventListener("click", registerClick);

loginFields.appendChild(emailFieldBox);
loginFields.appendChild(passwordFieldBox);
loginFields.appendChild(emailField);
loginFields.appendChild(passwordField);
loginFields.appendChild(forgotPasswordButton);

buttons.appendChild(loginButton);
buttons.appendChild(registerButton);