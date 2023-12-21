import { HttpClient } from "./http-client.service.js";

const client = new HttpClient();
const button = document.querySelector('#loginForm button[type="submit"]');
const forgotButton = document.querySelector(
  '#forgotPassswordForm button[type="submit"]'
);
const signupButton = document.querySelector(
  '#signupForm button[type="submit"]'
);
const user_email = document.querySelector("#user_email_address");
const user_password = document.querySelector("#user_password");
const new_password = document.querySelector("#new_password");
const password_span = document.querySelector("#show-password");

if (user_email !== undefined && user_email !== null) {
  user_email.classList.remove("is-invalid");
  user_email.addEventListener("focus", (event) => {
    document.querySelector("#email_address_error").style.display = "none";
    if (user_email.classList.contains("is-invalid")) {
      user_email.classList.remove("is-invalid");
    }
  });
}

if (user_password !== undefined && user_password !== null) {
  password_span.classList.remove("password-span-error");
  user_password.classList.remove("is-invalid");
  user_password.addEventListener("focus", (event) => {
    document.querySelector("#password_error").style.display = "none";
    if (
      user_password.classList.contains("is-invalid") ||
      password_span.classList.contains("password-span-error")
    ) {
      password_span.classList.remove("password-span-error");
      user_password.classList.remove("is-invalid");
    }
  });
}

if (new_password !== undefined && new_password !== null) {
  password_span.classList.remove("password-span-error");
  new_password.classList.remove("is-invalid");
  new_password.addEventListener("focus", (event) => {
    document.querySelector("#password_error").style.display = "none";
    if (
      new_password.classList.contains("is-invalid") ||
      password_span.classList.contains("password-span-error")
    ) {
      password_span.classList.remove("password-span-error");
      new_password.classList.remove("is-invalid");
    }
  });
}

if (button !== undefined && button !== null) {
  // Submit handler
  button.addEventListener("click", (event) => {
    console.log("clicked");
    event.preventDefault();
    if (user_email != undefined && user_email.value == "") {
      user_email.classList.add("is-invalid");
    }
    if (user_password != undefined && user_password.value == "") {
      user_password.classList.add("is-invalid");
      password_span.classList.add("password-span-error");
      return false;
    }

    client.post(
      "/api/auth/login",
      JSON.stringify({
        user_email: user_email.value,
        user_password: user_password.value,
      }),
      (response, request) => {
        response = JSON.parse(response);
        if (request.status != 200) {
          showErrorMessage(response);
        } else {
          window.location.replace("/tickets");
        }
      }
    );
  });
} else if (forgotButton !== undefined && forgotButton !== null) {
  // Submit handler for forgot button
  forgotButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (user_email != undefined && user_email.value == "") {
      user_email.classList.add("is-invalid");
    }
    if (new_password != undefined && new_password.value == "") {
      new_password.classList.add("is-invalid");
      password_span.classList.add("password-span-error");
      return false;
    }

    client.post(
      "/api/user/password-reset",
      JSON.stringify({ email: user_email.value, password: new_password.value }),
      (response, request) => {
        response = JSON.parse(response);
        if (request.status != 200) {
          showErrorMessage(response);
        } else {
          window.location.replace("/");
        }
      }
    );
  });
} else if (signupButton !== undefined && signupButton !== null) {
  const email = document.querySelector("#email_address");
  const first_name = document.querySelector("#first_name");
  const last_name = document.querySelector("#last_name");
  const password = document.querySelector("#password");

  [email, first_name, last_name, password].forEach((element) => {
    element.addEventListener("focus", (event) => {
      if (
        element.classList.contains("is-invalid") ||
        element.classList.contains("password-span-error")
      ) {
        element.classList.remove("password-span-error");
        element.classList.remove("is-invalid");
      }
    });
  });

  // Submit handler for forgot button
  signupButton.addEventListener("click", (event) => {
    event.preventDefault();
    var error = false;
    [email, first_name, last_name, password].forEach((element) => {
      if (element != undefined && element.value == "") {
        error = true;
        element.classList.add("is-invalid");
        if (element.id == "password") {
          document
            .querySelector("#password_error")
            .classList.add("password-span-error");
        }
      }
    });

    if (error) {
      return false;
    }

    client.post(
      "/api/user/create",
      JSON.stringify({ email: user_email.value, password: new_password.value }),
      (response, request) => {
        response = JSON.parse(response);
        if (request.status != 200) {
          showErrorMessage(response);
        } else {
          window.location.replace("/");
        }
      }
    );
  });
}

function showErrorMessage(response) {
  document.querySelector("#" + response.field + "_error").innerHTML =
    response.message;
  document.querySelector("#" + response.field + "_error").style.display =
    "block";
}

password_span.addEventListener("click", (event) => {
  [user_password, new_password].forEach((element) => {
    if (element != undefined) {
      if (element.type == "password") {
        element.type = "text";
      } else {
        element.type = "password";
      }
    }
  });
});
