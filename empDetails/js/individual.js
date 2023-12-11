//#region GLOBALS
switch (document.location.hostname) {
  case "kdt-ph":
    rootFolder = "//kdt-ph/";
    break;
  case "localhost":
    rootFolder = "//localhost/";
    break;
  default:
    rootFolder = "//kdt-ph/";
    break;
}
var empDetails = [];

//#endregion
checkLogin();

//#region BINDS
$(document).ready(function () {
  mainHeight();
});
$(window).on("resize", function () {
  mainHeight();
});
$(document).on("click", ".table-titles .title.first", function () {
  $(".table-titles .title.second, .table-two").removeClass("active");
  $(this).addClass("active");
  $(".table-one").addClass("active");
});
$(document).on("click", ".table-titles .title.second", function () {
  $(".table-titles .title.second, .table-two").addClass("active");
  $(".table-titles .title.first, .table-one").removeClass("active");
});
$(document).on("click", ".seeMore", function () {
  window.location.href = "path/to/your/page.html";
});
$(document).on("click", "#menu", function () {
  $(".navigation").addClass("open");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
});
$(document).on("mouseenter", ".editThis", function () {
  $(this).addClass("hov");
});
$(document).on("mouseleave", ".editThis", function () {
  $(this).removeClass("hov");
});
//#endregion

//#region FUNCTIONS

function checkLogin() {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "php/check_login.php",
      success: function (data) {
        const emp_deets = $.parseJSON(data);
        if (Object.keys(emp_deets).length < 1) {
          reject("Not logged in"); // Reject the promise
        } else {
          resolve(emp_deets); // Resolve the promise with empDetails
        }
      },
    });
  });
}
function mainHeight() {
  var title = $(".pageTitle").css("height");

  if ($(window).width() > 768) {
    $(".main").css("height", `calc(100vh - ${title}`);
    console.log(title);
  } else {
    $(".main").css("height", `100%`);
  }
}

//#endregion
