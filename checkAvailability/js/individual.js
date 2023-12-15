//#region GLOBALS
// switch (document.location.hostname) {
//   case "kdt-ph":
//     rootFolder = "//kdt-ph/";
//     break;
//   case "localhost":
//     rootFolder = "//localhost/";
//     break;
//   default:
//     rootFolder = "//kdt-ph/";
//     break;
// }
var dispatch_days = 0;
//#endregion

//#region BINDS
$(document).ready(function () {
  Promise.all([getGroups(), getEmployees()])
    .then(([grps, emps]) => {
      fillGroups(grps);
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("change", "#grpSel", function () {
  getEmployees().then((emps) => {
    fillEmployees(emps);
  });
});
$(document).on("change", ".ddates", function () {
  countDays();
});
$(document).on("change", "#empSel", function () {
  Promise.all([
    getPassport(),
    getVisa(),
    getDispatchHistory(),
    getDispatchDays(),
  ])
    .then(([pass, vsa, dlst, dd]) => {
      console.log(pass);
      console.log(vsa);
      dispatch_days = dd;
      fillHistory(dlst);
      countTotal();
    })
    .catch((error) => {
      alert(`${error}`);
    });
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
  grpSelect.html("<option>Select Group</option>");
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
  empSelect.html("<option hidden>Select Employee</option>");
  $.each(emps, function (index, item) {
    var option = $("<option>")
      // .attr("value", item.id)
      .text(item.name)
      .attr("emp-id", item.id);
    empSelect.append(option);
  });
}
function countDays() {
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
    $("#daysCount").text("");
    return;
  }
  var timeDifference = endDate - startDate;
  var daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

  if (daysDifference === 1) {
    $("#daysCount").text(" 1 day.");
  } else {
    $("#daysCount").text(`${daysDifference} days`);
  }
  countTotal();
}
function getPassport() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const sDate = $("#startDate").val();
  const eDate = $("#endDate").val();
  if (empID === undefined) {
    return;
  }
  return new Promise((resolve, reject) => {
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
function getVisa() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const sDate = $("#startDate").val();
  const eDate = $("#endDate").val();
  if (empID === undefined) {
    return;
  }
  return new Promise((resolve, reject) => {
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
function getDispatchHistory() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const yScope = $("#dToggle").val();
  if (empID === undefined) {
    return;
  }
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
    var noDataRow = $("<tr><td colspan='6'>No data found</td></tr>");
    tableBody.append(noDataRow);
  } else {
    $.each(dlist, function (index, item) {
      var row = $(`<tr d-id=${item.id}>`);
      row.append(`<td>${index + 1}</td>`);
      row.append(`<td>${item.from}</td>`);
      row.append(`<td>${item.to}</td>`);
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
  if (empID === undefined) {
    return;
  }
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
function countTotal() {
  const daysCount = !$("#daysCount").text()
    ? 0
    : parseInt($("#daysCount").text(), 10);
  const dispDays = parseInt(dispatch_days, 10);
  // return daysCount + dispDays;
  console.log(daysCount + dispDays);
}
function insertDispatch() {
  const empID = $("#empSel").find("option:selected").attr("emp-id");
  const startD = $("#startDate").val();
  const endD = $("#endDate").val();
  $.ajax({
    type: "POST",
    url: "php/insert_dispatch.php",
    data: {
      empID: empID,
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
//#endregion
