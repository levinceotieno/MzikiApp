// login_script.js

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
      window.location.href = '/'; // Redirect to home page upon successful login
    } else {
      console.error(data.error); // Log error message if login fails
    }
  }

  // Function to handle signup
  async function signup(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');
    const response = await fetch('/register', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      window.location.href = '/'; // Redirect to home page upon successful signup
    } else {
      console.error(data.error); // Log error message if signup fails
    }
  }

  // Function to handle sending message
  async function sendMessage(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    const response = await fetch('/contact-us', {
      method: 'POST',
      body: JSON.stringify({ name, email, message }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Message sent successfully');
      // Optionally, you can display a success message or redirect the user
    } else {
      console.error('Failed to send message');
      // Optionally, you can display an error message to the user
    }
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
});

