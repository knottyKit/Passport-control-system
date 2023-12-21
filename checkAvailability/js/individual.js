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
var dispatch_days = 0;
var to_add = 0;
const full = 183;
var empDetails = [];
//#endregion
checkLogin()
  .then((emp_deets) => {
    empDetails = emp_deets;
    checkAccess()
      .then((acc) => {
        if (acc) {
          $(document).ready(function () {
            Promise.all([getGroups(), getEmployees(), getLocations()])
              .then(([grps, emps, locs]) => {
                fillGroups(grps);
                fillEmployees(emps);
                fillLocations(locs);
              })
              .catch((error) => {
                alert(`${error}`);
              });
            mainHeight();
          });
        } else {
          alert("Access denied");
          window.location.href = "../";
        }
      })
      .catch((error) => {
        alert(`${error}`);
      });
  })
  .catch((error) => {
    alert(error);
    window.location.href = `${rootFolder}/KDTPortalLogin`;
  });
//#region BINDS

$(window).resize(function () {
  mainHeight();
});

$(document).on("click", "#menu", function () {
  $(".navigation").addClass("open");
  $("body").addClass("overflow-hidden");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
  $("body").removeClass("overflow-hidden");
});
// $(document).on("mouseenter", ".editThis", function () {
//   $(this).addClass("hov");
// });
// $(document).on("mouseleave", ".editThis", function () {
//   $(this).removeClass("hov");
// });
$(document).on("change", "#grpSel", function () {
  getEmployees().then((emps) => {
    fillEmployees(emps);
  });
});
$(document).on("change", ".ddates", function () {
  var startD = $("#startDate").val();
  var endD = $("#endDate").val();

  if (!startD || !endD) {
    return;
  }
  var startDate = new Date(startD);
  var endDate = new Date(endD);
  if (endDate < startDate) {
    alert("End date must not be earlier than start date.");
    $("#endDate").val("");
    to_add = 0;
    countTotal();
    $("#daysCount").text("");
    return;
  }
  // var timeDifference = endDate - startDate;
  // var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
  // if (daysDifference === 1) {
  //   $("#daysCount").text(" 1 day.");
  // } else {
  //   $("#daysCount").text(`${daysDifference} days`);
  // }
  countDays(startD, endD)
    .then((cd) => {
      displayDays(cd);
      countTotal();
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("change", "#empSel", function () {
  Promise.all([
    getPassport(),
    getVisa(),
    getDispatchHistory(),
    getDispatchDays(),
  ])
    .then(([pass, vsa, dlst, dd]) => {
      fillPassport(pass);
      fillVisa(vsa);
      dispatch_days = dd;
      fillHistory(dlst);
      countTotal();
    })
    .catch((error) => {
      alert(`${error}`);
    });
  if ($(this).val() === 0) {
    $("#empDetails__name").text("");
    $(".emptyState").removeClass("d-none");
    $(".withContent").addClass("d-none");
  } else {
    const empID = $("#empSel").find("option:selected").attr("emp-id");
    $("#empDetails__id").text(empID);
    $("#empDetails__name").text($("#empSel option:selected").text());
    $(".emptyState").addClass("d-none");
    $(".withContent").removeClass("d-none");
  }
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
$(document).on("click", "#btnApply", function () {
  insertDispatch();
});
$(document).on("click", ".btn-clear", function () {
  dispatch_days = 0;
  clearInput();
  $(".emptyState").removeClass("d-none");
  $(".withContent").addClass("d-none");
});
// $(document).on("click", ".btn-delete", function () {
//   var name = $("#empSel option:selected").text();
//   var num = $(this).closest("tr").find("td:first-of-type").text();

//   $("#selectedEmp").html(name);
//   $("#storeId").html(num);
// });
$(document).on("click", ".btn-delete", function () {
  var num = $(this).closest("tr").find("td:first-of-type").html();

  var trID = $(this).closest("tr").attr("d-id");
  $("#storeId").html(num);
  $("#storeId").attr("del-id", trID);
});
$(document).on("click", "#btn-deleteEntry", function () {
  deleteDispatch();
});
$(document).on("click", "#updateEmp", function () {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  if (!empID) {
    return;
  } else {
    window.location.href = `../empDetails?id=${empID}`;
  }
});

//#endregion

//#region FUNCTIONS
function getGroups() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_groups.php",
      dataType: "json",
      success: function (response) {
        const grps = response;
        resolve(grps);
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
function fillGroups(grps) {
  var grpSelect = $("#grpSel");
  grpSelect.html("<option value='0'>Select Group</option>");
  $.each(grps, function (index, item) {
    var option = $("<option>")
      .attr("value", item.id)
      .text(item.name)
      .attr("grp-id", item.id);
    grpSelect.append(option);
  });
}
function getEmployees() {
  const grpID = $("#grpSel").find("option:selected").attr("grp-id");
  dispatch_days = 0;
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_employees.php",
      data: {
        grpID: grpID,
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
function fillEmployees(emps) {
  var empSelect = $("#empSel");
  empSelect.html("<option value='0' hidden>Select Employee</option>");
  $.each(emps, function (index, item) {
    var option = $("<option>")
      // .attr("value", item.id)
      .text(item.name)
      .attr("emp-id", item.id);
    empSelect.append(option);
  });
}
function countDays(strt, end) {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/check_add_duration.php",
      data: {
        dateFrom: strt,
        dateTo: end,
      },
      dataType: "json",
      success: function (response) {
        const countDays = response;
        resolve(countDays);
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

  var timeDifference = endDate - startDate;
  var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

  if (daysDifference === 1) {
    $("#daysCount").text(" 1 day.");
  } else {
    $("#daysCount").text(`${daysDifference} days`);
  }
  countTotal();
}
function displayDays(cdays) {
  if (cdays.difference === 1) {
    $("#daysCount").text(" 1 day.");
  } else {
    $("#daysCount").text(`${cdays.difference} days`);
  }
  to_add = cdays.toAdd;
}
function getPassport() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const sDate = $("#startDate").val();
  const eDate = $("#endDate").val();

  return new Promise((resolve, reject) => {
    if (empID === undefined) {
      resolve([]);
    }
    $.ajax({
      type: "POST",
      url: "php/get_passport.php",
      data: {
        empID: empID,
        sDate: sDate,
        eDate: eDate,
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
          reject("An unspecified error occurred.");
        }
      },
    });
  });
}
function fillPassport(pport) {
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
function getVisa() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const sDate = $("#startDate").val();
  const eDate = $("#endDate").val();
  return new Promise((resolve, reject) => {
    if (empID === undefined) {
      resolve([]);
    }
    $.ajax({
      type: "POST",
      url: "php/get_visa.php",
      data: {
        empID: empID,
        sDate: sDate,
        eDate: eDate,
      },
      dataType: "json",
      success: function (response) {
        const visa = response;
        resolve(visa);
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
function fillVisa(vsa) {
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
function getDispatchHistory() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const yScope = $("#dToggle").val();
  return new Promise((resolve, reject) => {
    if (empID === undefined) {
      resolve([]);
    }
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
    var noDataRow = $(
      "<tr><td colspan='7' class='text-center'>No data found</td></tr>"
    );
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
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  return new Promise((resolve, reject) => {
    if (empID === undefined) {
      resolve(0);
    }
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
function countTotal() {
  const daysCount = parseInt(to_add, 10);
  const dispDays = parseInt(dispatch_days, 10);
  var countText = "";
  const dd = daysCount + dispDays;
  if (dd == 1) {
    countText = `1 day`;
  } else {
    countText = `${dd} days`;
  }
  $("#rangeCount").text(countText);
  setBar(dd);
  colorBar(dd);
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
function insertDispatch() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const locID = $("#locSel").find("option:selected").attr("loc-id");
  const startD = $("#startDate").val();
  const endD = $("#endDate").val();
  if (!empID || !locID || !startD || !endD) {
    console.log("complete required fields");
    return;
  }
  $.ajax({
    type: "POST",
    url: "php/insert_dispatch.php",
    data: {
      empID: empID,
      locID: locID,
      dateFrom: startD,
      dateTo: endD,
    },
    dataType: "json",
    success: function (response) {
      const errorMsgs = response;
      if (Object.keys(errorMsgs).length > 0) {
        alert(`${errorMsgs.errors.conflict}`); // Reject the promise
      } else {
        Promise.all([getDispatchHistory(), getDispatchDays()])
          .then(([dlst, dd]) => {
            fillHistory(dlst);
            dispatch_days = dd;
            $("#startDate").val("");
            $("#endDate").val("");
            $("#daysCount").text("");
            to_add = 0;
            countTotal();
          })
          .catch((error) => {
            alert(`${error}`);
          });
      }
    },
    error: function (xhr, status, error) {
      if (xhr.status === 404) {
        alert("Not Found Error: The requested resource was not found.");
      } else if (xhr.status === 500) {
        alert("Internal Server Error: There was a server error.");
      } else {
        alert("An unspecified error occurredxdxd.");
      }
    },
  });
}
function clearInput() {
  $("#grpSel, #empSel, #locSel").val(0);
  $("#startDate, #endDate").val("");
  to_add = 0;
  $("#daysCount").text("");
  $("#empSel").change();
}
function mainHeight() {
  var title = $(".pageTitle").css("height");

  if ($(window).width() > 1456) {
    $(".main").css("height", `calc(100vh - ${title}`);
    console.log(title);
  } else {
    $(".main").css("height", ``);
  }
}
function getLocations() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_location.php",
      dataType: "json",
      success: function (response) {
        const locs = response;
        resolve(locs);
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
function fillLocations(locs) {
  var locSelect = $("#locSel");
  locSelect.html("<option value='0'>Select Location</option>");
  $.each(locs, function (index, item) {
    var option = $("<option>")
      .attr("value", item.id)
      .text(item.name)
      .attr("loc-id", item.id);
    locSelect.append(option);
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
          dispatch_days = dd;
          countTotal();
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
function checkLogin() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/check_login.php",
      dataType: "json",
      success: function (data) {
        const emp_deets = data;
        if (Object.keys(emp_deets).length < 1) {
          reject("Not logged in"); // Reject the promise
        } else {
          resolve(emp_deets); // Resolve the promise with empDetails
        }
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
function checkAccess() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/check_permission.php",
      data: {
        empNum: empDetails["empNum"],
      },
      dataType: "json",
      success: function (data) {
        const acc = data;
        resolve(acc);
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
//#endregion
