"use strict";
(function($) {})($);

//toggle Login/SignUp
(function($) {
  //jQuery and vanilla to practice with both
  let signUpBtn = document.getElementsByClassName("btn_signUp")[0];
  let loginBtn = $(".btn_login");
  let signUpForm = $("#SignUp");
  let loginForm = document.getElementById("Login");

  loginBtn.on("click", e => {
    signUpForm.toggleClass("d-none");
    loginForm.classList.remove("d-none");
  });
  console.log(signUpBtn);
  signUpBtn.addEventListener("click", toggleClass);

  function toggleClass() {
    signUpForm.toggleClass("d-none");
    loginForm.classList.add("d-none");
  }
})($);

//toggle tooltip
(function($) {
  $("[data-toogle=tooltip]").tooltip();
})($);
