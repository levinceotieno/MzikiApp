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
  function login() {
    // Add your login logic here
    console.log("Login logic goes here");
  }

  // Function to handle signup
  function signup() {
    // Add your signup logic here
    console.log("Signup logic goes here");
  }

  // Function to handle forgot password
  function forgotPassword() {
    // Add your forgot password logic here
    console.log("Forgot password logic goes here");
  }

  // Function to handle sending message
  function sendMessage() {
    // Add your send message logic here
    console.log("Send message logic goes here");
  }

  // Initial setup
  hideAllPages();
  showLoginPage();
});

