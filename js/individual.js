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

//#endregion
