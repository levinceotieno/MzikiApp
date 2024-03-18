//login_script.js
document.addEventListener("DOMContentLoaded", function() {
  // Function to show login page
  function showLoginPage() {
    hideAllPages();
    document.getElementById("loginPage").style.display = "flex";
  }

  // Function to show signup page
  function showSignupPage() {
    hideAllPages();
    document.getElementById("signupPage").style.display = "flex";
  }

  // Function to show forgot password page
  function showForgotPasswordPage() {
    hideAllPages();
    document.getElementById("forgotPasswordPage").style.display = "flex";
  }

  // Function to show contact us page
  function showContactUsPage() {
    hideAllPages();
    document.getElementById("contactUsPage").style.display = "flex";
  }

  // Function to hide all pages
  function hideAllPages() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "none";
    document.getElementById("forgotPasswordPage").style.display = "none";
    document.getElementById("contactUsPage").style.display = "none";
  }

  // Function to handle login
  async function login(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const response = await fetch('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      window.location.href = '/index'; // Redirect to home page upon successful login
    } else {
      const errorMessage = document.getElementById('login-error-message');
      errorMessage.innerText = data.error; // Display error message
      errorMessage.style.display = 'block'; // Show the error message
    }
  }

  // Function to handle signup
  async function signup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const response = await fetch('/signup', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      window.location.href = '/index'; // Redirect to home page upon successful signup
    } else {
      const errorMessage = document.getElementById('signup-error-message');
      errorMessage.innerText = data.error; // Display error message
      errorMessage.style.display = 'block'; // Show the error message
    }
  }

  // Function to handle sending message
  async function sendMessage(event) {
    console.log('sendMessage function is triggered');
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    const response = await fetch('/contact-us', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Response:', response);
    const data = await response.json();
    console.log('Data:', data);
    if (response.ok) {
      console.log('Message sent successfully');
      // Optionally, you can display a success message or redirect the user
    } else {
      console.error('Failed to send message');
      // Optionally, you can display an error message to the user
    }
  }

  // Function to switch to the signup page
  function switchToSignup() {
    showSignupPage();
  }

  function switchToContactUs() {
	  showContactUsPage();
  }

  // Initial setup
  hideAllPages();
  showLoginPage();

  // Attach login function to form submission
  const loginForm = document.querySelector('#loginPage form');
  if (loginForm) {
    loginForm.addEventListener('submit', login);
  }

  // Attach signup function to form submission
  const signupForm = document.querySelector('#signupPage form');
  if (signupForm) {
    signupForm.addEventListener('submit', signup);
  }

  // Attach sendMessage function to contact us form submission
  const contactUsForm = document.querySelector('#contactUsPage form');
  if (contactUsForm) {
    contactUsForm.addEventListener('submit', sendMessage);
  }

  // Attach logout function to logout button click
  const logoutButton = document.querySelector('#logoutButton');
  if (logoutButton) {
       logoutButton.addEventListener('click', logout);
  }

  // Attach event listener to switch to signup page link or button
  const switchToSignupButton = document.querySelector('#switchToSignup');
  if (switchToSignupButton) {
    switchToSignupButton.addEventListener('click', switchToSignup);
  }
  // Function to go back to the login page
  function backToLogin() {
      window.location.href = '/login'; // Redirect to login page
  }

  // Attach event listener to the "Back to Login" button
  const backToLoginButton = document.getElementById('backToLogin');
  if (backToLoginButton) {
      backToLoginButton.addEventListener('click', backToLogin);
  }

  // Attach event listener to switch to contact us page button
  const switchToContactUsButton = document.querySelector('#switchToContactUs');
  if (switchToContactUsButton) {
	  switchToContactUsButton.addEventListener('click', switchToContactUs);
  }
  const backToLoginContactButton = document.getElementById('backToLoginContact');
  if (backToLoginContactButton) {
      backToLoginContactButton.addEventListener('click', backToLogin);
  }
});
