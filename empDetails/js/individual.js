//#region GLOBALS
var empID = 0;

//#endregion

//#region BINDS
$(document).ready(function () {
  const url_string = window.location;
  const url = new URL(url_string);
  empID = url.searchParams.get("id");

  Promise.all([getEmployeeDetails()])
    .then(([emps]) => {
      fillDetails(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
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
  $("body").addClass("overflow-hidden");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
  $("body").removeClass("overflow-hidden");
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
$(document).on("click", ".btn-delete", function () {
  var num = $(this).closest("tr").find("td:first-of-type").html();
  $("#storeId").html(num);
});
$(document).on("click", "#btn-deleteEntry", function () {
  var num = parseInt($("#storeId").html());

  $(".bot table tbody tr")
    .find("td:first-of-type")
    .filter(function () {
      return parseInt($(this).text()) === num;
    })
    .closest("tr")
    .remove();

  $("#deleteEntry .btn-close").click();
});
//#endregion

//#region FUNCTIONS
function mainHeight() {
  var title = $(".pageTitle").css("height");

  if ($(window).width() > 1456) {
    $(".main").css("height", `calc(100vh - ${title}`);
    console.log(title);
  } else {
    $(".main").css("height", ``);
  }
}
// function resizeTable() {
//   var h1 = parseInt($(".top").css("height"));
//   var h2 = parseInt($(".mid").css("height"));

//   $(".bot").css("height", h1 + h2);
// }
function dispatchStatus() {
  var stat = $("#dispatchStatus").val();
  if (stat == 0) {
    $("#dispatchStatus").addClass("text-success").removeClass("text-danger");
  }
  if (stat == 1) {
    $("#dispatchStatus").addClass("text-danger").removeClass("text-success");
  }
}
function getEmployeeDetails() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_emp_details.php",
      data: {
        empID: empID,
      },
      dataType: "json",
      success: function (response) {
        const emps = response;
        resolve(emps);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.");
        }
      },
    });
  });
}
function fillDetails(empnum) {
  $("#empId").text(`${empnum.id}`);
  $(".surname").text(`${empnum.lastname},`);
  $(".givenname").text(`${empnum.firstname}`);
  $("#empPic").attr("src", `${empnum.pictureLink}`);
}
//#endregion
