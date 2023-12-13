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
  dispatchStatus();
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
$(document).on("change", "#dispatchStatus", function () {
  dispatchStatus();
});
$(document).on("click", "#btn-updateVisa", function () {
  $("#updateVisa").find("input").removeAttr("disabled");
  $(this).closest(".modal").find(".attach").removeClass("d-none");
  $(this).closest(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
            Cancel
          </button>
          <button type="button" class="btn btn-success" id="btn-saveVisa">
            Save Changes
          </button>
  `);
});
$(document).on("click", "#btn-updatePass", function () {
  $("#updatePass").find("input").removeAttr("disabled");
  $(this).closest(".modal").find(".attach").removeClass("d-none");
  $(this).closest(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
            Cancel
          </button>
          <button type="button" class="btn btn-success" id="btn-savePass">
            Save Changes
          </button>
  `);
});
$(document).on("click", ".btn-close", function () {
  $(this).closest(".modal").find(".attach").addClass("d-none");
  $(this).closest(".modal").find("input").attr("disabled", true);
});
$(document).on("click", ".btn-cancel", function () {
  $(this).closest(".modal").find(".btn-close").click();
});
$(document).on("click", "#updatePass .btn-close", function () {
  $(this).closest(".modal").find(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
  Cancel
</button>
<button type="button" class="btn btn-update" id="btn-updatePass">
  Update Passport
</button>
  `);
});
$(document).on("click", "#updateVisa .btn-close", function () {
  $(this).closest(".modal").find(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
  Cancel
</button>
<button type="button" class="btn btn-update" id="btn-updateVisa">
  Update Visa
</button>
  `);
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
function dispatchStatus() {
  var stat = $("#dispatchStatus").val();
  if (stat == 0) {
    $("#dispatchStatus").addClass("text-success").removeClass("text-danger");
  }
  if (stat == 1) {
    $("#dispatchStatus").addClass("text-danger").removeClass("text-success");
  }
}

//#endregion
