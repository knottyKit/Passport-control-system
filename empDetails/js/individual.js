//#region GLOBALS
var empID = 0;
var userPass = [];
var userVisa = [];
const full = 183;
// var dispatch_days = 0;
//#endregion

//#region BINDS
$(document).ready(function () {
  const url_string = window.location;
  const url = new URL(url_string);
  empID = url.searchParams.get("id");

  Promise.all([
    getEmployeeDetails(),
    getPassport(),
    getVisa(),
    getDispatchHistory(),
    getDispatchDays(),
  ])
    .then(([emps, pport, vsa, dlst, dd]) => {
      userPass = pport;
      userVisa = vsa;
      fillDetails(emps);
      fillPassport(userPass);
      fillVisa(userVisa);
      fillHistory(dlst);
      displayDays(dd);
      // dispatch_days = dd;
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
  // $(this).closest(".modal").find(".attach").removeClass("d-none");
  $(this).closest(".modal-footer").html(`
  <button type="button" class="btn btn-secondary"  id="cancelEditVisa">
            Cancel
          </button>
          <button type="button" class="btn btn-success" id="btn-saveVisa">
            Save Changes
          </button>
  `);
});
$(document).on("click", "#btn-updatePass", function () {
  $("#updatePass").find("input").removeAttr("disabled");
  // $(this).closest(".modal").find(".attach").removeClass("d-none");
  $(this).closest(".modal-footer").html(`
  <button type="button" class="btn btn-secondary" id="cancelEditPass">
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
  resetPassInput();
});
$(document).on("click", "#updateVisa .btn-close", function () {
  resetVisaInput();
});
$(document).on("click", ".btn-delete", function () {
  var num = $(this).closest("tr").find("td:first-of-type").html();

  var trID = $(this).closest("tr").attr("d-id");
  $("#storeId").html(num);
  $("#storeId").attr("del-id", trID);
});
$(document).on("click", "#btn-deleteEntry", function () {
  deleteDispatch();
});
$(document).on("change", "#dToggle", function () {
  getDispatchHistory()
    .then((dlst) => {
      fillHistory(dlst);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("click", "#btn-saveDisStat", function () {
  saveStat();
});
$(document).on("click", "#btn-savePass", function () {
  savePass();
});
$(document).on("click", "#btn-saveVisa", function () {
  saveVisa();
});
$(document).on("click", "#cancelEditPass", function () {
  resetPassInput();
});
$(document).on("click", "#cancelEditVisa", function () {
  resetVisaInput();
});
$(document).on("change", ".ddates.pass", function () {
  var startD = $("#upPassIssue").val();
  var endD = $("#upPassExp").val();

  if (!startD || !endD) {
    return;
  }
  var startDate = new Date(startD);
  var endDate = new Date(endD);
  if (endDate < startDate) {
    alert("End date must not be earlier than start date.");
    $("#upPassExp").val("");
    return;
  }
});
$(document).on("change", ".ddates.vsa", function () {
  var startD = $("#upVisaIssue").val();
  var endD = $("#upVisaExp").val();

  if (!startD || !endD) {
    return;
  }
  var startDate = new Date(startD);
  var endDate = new Date(endD);
  if (endDate < startDate) {
    alert("End date must not be earlier than start date.");
    $("#upVisaExp").val("");
    return;
  }
});
//#endregion

//#region FUNCTIONS
function mainHeight() {
  var title = $(".pageTitle").css("height");

  if ($(window).width() > 1456) {
    $(".main").css("height", `calc(100vh - ${title}`);
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
  if (stat == 1) {
    $("#dispatchStatus").addClass("text-success").removeClass("text-danger");
  }
  if (stat == 0) {
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
          reject("An unspecified error occurred.1");
        }
      },
    });
  });
}
function fillDetails(empnum) {
  $("#empId").text(`${empnum.id}`);
  $(".surname").text(`${empnum.lastname},`);
  $(".givenname").text(`${empnum.firstname}`);
  $("#empPic").attr("src", empnum.pictureLink);
  if (empnum.dispatch == 0) {
    $("#dStat").addClass("bg-danger").removeClass("bg-success");
    $("#dStat").text("Non Dispatch");
  } else {
    $("#dStat").addClass("bg-success").removeClass("bg-danger");
    $("#dStat").text("For Dispatch");
  }
  $("#dispatchStatus").val(empnum.dispatch);
  dispatchStatus();
  $("#disModalEmpName").text(`${empnum.firstname} ${empnum.lastname}`);
}
function getPassport() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_passport.php",
      data: {
        empID: empID,
      },
      dataType: "json",
      success: function (response) {
        const pport = response;
        resolve(pport);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.2");
        }
      },
    });
  });
}
function fillPassport(pport) {
  passportDisplay(pport);
  passportInput(pport);
}
function passportDisplay(pport) {
  if (Object.keys(pport).length > 0) {
    const pnum = pport.number;
    const pbday = pport.bday;
    const pissue = pport.issue;
    const pexpiry = pport.expiry;
    const pvalid = pport.valid;
    $("#passNo").text(pnum);
    $("#passBday").text(pbday);
    $("#passIssue").text(pissue);
    $("#passExp").text(pexpiry);
    if (pvalid) {
      $("#passStatus").removeClass("bg-danger");
      $("#passStatus").addClass("bg-success");
      $("#passStatus").text("Valid");
    } else {
      $("#passStatus").removeClass("bg-success");
      $("#passStatus").addClass("bg-danger");
      $("#passStatus").text("Expired");
    }
    $("#passDeets").removeClass("d-none");
    $("#passEmpty").addClass("d-none");
  } else {
    $("#passDeets").addClass("d-none");
    $("#passEmpty").removeClass("d-none");
  }
}
function passportInput(pport) {
  const pnum = pport.number;
  const pbday = pport.bday;
  const pissue = pport.issue;
  const pexpiry = pport.expiry;
  $("#upPassNo").val(pnum);
  $("#upPassBday").val(pbday);
  $("#upPassIssue").val(pissue);
  $("#upPassExp").val(pexpiry);
}
function getVisa() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_visa.php",
      data: {
        empID: empID,
      },
      dataType: "json",
      success: function (response) {
        const vsa = response;
        resolve(vsa);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.3");
        }
      },
    });
  });
}
function fillVisa(vsa) {
  visaDisplay(vsa);
  visaInput(vsa);
}
function visaDisplay(vsa) {
  if (Object.keys(vsa).length > 0) {
    const vnum = vsa.number;
    const vissue = vsa.issue;
    const vexpiry = vsa.expiry;
    const vvalid = vsa.valid;
    $("#visaNo").text(vnum);
    $("#visaIssue").text(vissue);
    $("#visaExp").text(vexpiry);
    if (vvalid) {
      $("#visaStatus").removeClass("bg-danger");
      $("#visaStatus").addClass("bg-success");
      $("#visaStatus").text("Valid");
    } else {
      $("#visaStatus").removeClass("bg-success");
      $("#visaStatus").addClass("bg-danger");
      $("#visaStatus").text("Expired");
    }
    $("#visaDeets").removeClass("d-none");
    $("#visaEmpty").addClass("d-none");
  } else {
    $("#visaDeets").addClass("d-none");
    $("#visaEmpty").removeClass("d-none");
  }
}
function visaInput(vsa) {
  const vnum = vsa.number;
  const vissue = vsa.issue;
  const vexpiry = vsa.expiry;
  $("#upVisaNo").val(vnum);
  $("#upVisaIssue").val(vissue);
  $("#upVisaExp").val(vexpiry);
}
function getDispatchHistory() {
  const yScope = parseInt($("#dToggle").val());

  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_dispatch_history.php",
      data: {
        empID: empID,
        yScope: yScope,
      },
      dataType: "json",
      success: function (response) {
        const dList = response;
        resolve(dList);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurred.haha");
        }
      },
    });
  });
}
function fillHistory(dlist) {
  var tableBody = $("#dList");
  tableBody.empty();
  if (dlist.length === 0) {
    var noDataRow = $("<tr><td colspan='7'>No data found</td></tr>");
    tableBody.append(noDataRow);
  } else {
    $.each(dlist, function (index, item) {
      var row = $(`<tr d-id=${item.id}>`);
      row.append(`<td>${index + 1}</td>`);
      row.append(`<td>${item.locationName}</td>`);
      row.append(`<td>${item.fromDate}</td>`);
      row.append(`<td>${item.toDate}</td>`);
      row.append(`<td>${item.duration}</td>`);
      row.append(`<td>${item.pastOne}</td>`);
      row.append(`<td>                            <div class="d-flex gap-2">
      <button
        class="btn-delete"
        title="Delete Entry"
        data-bs-toggle="modal"
        data-bs-target="#deleteEntry"
      >
        <i class="bx bx-trash fs-5"></i>
      </button>
    </div></td>`);
      tableBody.append(row);
    });
  }
}
function getDispatchDays() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/check_duration.php",
      data: {
        empID: empID,
      },
      success: function (response) {
        const dDays = response;
        resolve(dDays);
      },
      error: function (xhr, status, error) {
        if (xhr.status === 404) {
          reject("Not Found Error: The requested resource was not found.");
        } else if (xhr.status === 500) {
          reject("Internal Server Error: There was a server error.");
        } else {
          reject("An unspecified error occurreds.");
        }
      },
    });
  });
}
function displayDays(dd) {
  var countText = "";
  if (dd == 1) {
    countText = `1 day`;
  } else {
    countText = `${dd} days`;
  }
  $("#dCount").text(countText);
  setBar(dd);
  colorBar(dd);
}
function saveStat() {
  const disStat = $("#dispatchStatus").val();
  $.ajax({
    type: "POST",
    url: "php/update_dispatch_status.php",
    data: {
      empID: empID,
      dispatch: disStat,
    },
    success: function (response) {
      console.log(response);
      getEmployeeDetails()
        .then((emps) => {
          fillDetails(emps);
          $("#cancelStat").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function deleteDispatch() {
  const delID = $("#storeId").attr("del-id");
  $.ajax({
    type: "POST",
    url: "php/delete_dispatch_history.php",
    data: {
      dispatchID: delID,
    },
    success: function (response) {
      Promise.all([getDispatchHistory(), getDispatchDays()])
        .then(([dlst, dd]) => {
          fillHistory(dlst);
          displayDays(dd);
          $("#deleteEntry .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function setBar(dd) {
  const wd = (dd / full) * 100;
  $("#progBar").css("width", `${wd}%`);
}
function colorBar(dd) {
  $("#daysWarning").addClass("d-none");
  if (dd >= full) {
    $("#progBar").addClass("bg-danger").removeClass("bg-success bg-warning");
    if (dd > full) {
      $("#daysWarning").removeClass("d-none");
    }
  } else if (dd >= 150 && dd < full) {
    $("#progBar").addClass("bg-warning").removeClass("bg-success bg-danger");
  } else {
    $("#progBar").addClass("bg-success").removeClass("bg-warning bg-danger");
  }
}
function savePass() {
  const passNo = $("#upPassNo").val();
  const passBday = $("#upPassBday").val();
  const passIssue = $("#upPassIssue").val();
  const passExp = $("#upPassExp").val();
  if (!passNo || !passBday || !passIssue || !passExp) {
    console.log("may empty");
    return;
  }
  $.ajax({
    type: "POST",
    url: "php/update_passport.php",
    data: {
      empID: empID,
      number: passNo,
      birthdate: passBday,
      issued: passIssue,
      expiry: passExp,
    },
    success: function (response) {
      getPassport()
        .then((pport) => {
          userPass = pport;
          fillPassport(userPass);
          $("#updatePass .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function resetPassInput() {
  fillPassport(userPass);
  $("#upPassNo").attr("disabled", true);
  $("#upPassBday").attr("disabled", true);
  $("#upPassIssue").attr("disabled", true);
  $("#upPassExp").attr("disabled", true);
  $("#updatePass .btn-close").closest(".modal").find(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
  Cancel
</button>
<button type="button" class="btn btn-update" id="btn-updatePass">
  Update Passport
</button>
  `);
}
function saveVisa() {
  const visaNo = $("#upVisaNo").val();
  const visaIssue = $("#upVisaIssue").val();
  const visaExp = $("#upVisaExp").val();
  if (!visaNo || !visaIssue || !visaExp) {
    console.log("may empty");
    return;
  }
  $.ajax({
    type: "POST",
    url: "php/update_visa.php",
    data: {
      empID: empID,
      number: visaNo,
      issued: visaIssue,
      expiry: visaExp,
    },
    success: function (response) {
      getVisa()
        .then((vsa) => {
          userVisa = vsa;
          fillVisa(userVisa);
          $("#updateVisa .btn-close").click();
        })
        .catch((error) => {
          alert(`${error}`);
        });
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        reject("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        reject("Internal Server Error: There was a server error.");
      } else {
        reject("An unspecified error occurreds.");
      }
    },
  });
}
function resetVisaInput() {
  fillVisa(userVisa);
  $("#upVisaNo").attr("disabled", true);
  $("#upVisaIssue").attr("disabled", true);
  $("#upVisaExp").attr("disabled", true);
  $("#updateVisa .btn-close").closest(".modal").find(".modal-footer").html(`
  <button type="button" class="btn btn-cancel btn-secondary">
  Cancel
</button>
<button type="button" class="btn btn-update" id="btn-updateVisa">
  Update Visa
</button>
  `);
}
//#endregion
