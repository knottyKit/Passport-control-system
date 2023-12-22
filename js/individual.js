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
//#endregion

checkAccess()
  .then((acc) => {
    if (acc) {
      $(document).ready(function () {
        Promise.all([
          getDispatchlist(),
          getExpiringPassport(),
          getExpiringVisa(),
        ])
          .then(([dList, epList, evList]) => {
            fillDispatchList(dList);
            fillPassport(epList);
            fillVisa(evList);
          })
          .catch((error) => {
            alert(`${error}`);
          });
      });
    } else {
      alert("Access denied");
      window.location.href = `${rootFolder}`;
    }
  })
  .catch((error) => {
    alert(`${error}`);
  });

//#region BINDS

$(document).on("change", "#idYear", function () {
  getDispatchlist()
    .then((dList) => {
      fillDispatchList(dList);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("click", "#menu", function () {
  $(".navigation").addClass("open");
  $("body").addClass("overflow-hidden");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
  $("body").removeClass("overflow-hidden");
});
$(document).on("click", ".rowEmp", function () {
  var empID = $(this).attr("emp-id");
  window.location.href = `./empDetails?id=${empID}`;
});
//#endregion

//#region FUNCTIONS
function getDispatchlist() {
  const ySel = $("#idYear").val();
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_dispatch_list.php",
      data: {
        ySelect: ySel,
      },
      dataType: "json",
      success: function (data) {
        const dList = data;
        resolve(dList);
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
function fillDispatchList(dlist) {
  var tableBody = $("#dlist");
  tableBody.empty();
  if (dlist.length === 0) {
    var noDataRow = $("<tr><td colspan='4'>No data found</td></tr>");
    tableBody.append(noDataRow);
  } else {
    $.each(dlist, function (index, item) {
      var passClass = "bg-success";
      var passVal = "Valid";
      var visaClass = "bg-success";
      var visaVal = "Valid";
      if (!item.passValid) {
        passClass = "bg-danger";
        passVal = "Invalid";
      }
      if (!item.visaValid) {
        visaClass = "bg-danger";
        visaVal = "Invalid";
      }
      var row = $("<tr>");
      row.append(`<td>${item.name}</td>`);
      row.append(`<td>${item.location}</td>`);
      row.append(`<td>${item.from}</td>`);
      row.append(`<td>${item.to}</td>`);
      row.append(`<td><span class="badge ${passClass}">${passVal}</span></td>`);
      row.append(`<td><span class="badge ${visaClass}">${visaVal}</span></td>`);
      tableBody.append(row);
    });
  }
}
function getExpiringPassport() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_expiring_passport.php",
      dataType: "json",
      success: function (data) {
        const epList = data;
        resolve(epList);
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
function fillPassport(eplist) {
  var tableBody = $("#eplist");
  tableBody.empty();
  if (eplist.length === 0) {
    var noDataRow = $("<tr><td colspan='2'>No expiring passports</td></tr>");
    tableBody.append(noDataRow);
  } else {
    $.each(eplist, function (index, item) {
      var row = $(`<tr class="rowEmp" emp-id="${item.id}">`);
      var untilText = formatDays(item.until);
      var isShort = item.until < 300 ? "short" : "";
      row.append(`<td>${item.name}</td>`);
      row.append(`<td class="expire ${isShort}">${untilText}</td>`);
      tableBody.append(row);
    });
  }
}
function getExpiringVisa() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_expiring_visa.php",
      dataType: "json",
      success: function (data) {
        const evList = data;
        resolve(evList);
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
function fillVisa(evlist) {
  var tableBody = $("#evlist");
  tableBody.empty();
  if (evlist.length === 0) {
    var noDataRow = $("<tr><td colspan='2'>No expiring visa</td></tr>");
    tableBody.append(noDataRow);
  } else {
    $.each(evlist, function (index, item) {
      var row = $(`<tr class="rowEmp" emp-id="${item.id}">`);
      var untilText = formatDays(item.until);
      var isShort = item.until < 210 ? "short" : "";
      row.append(`<td>${item.name}</td>`);
      row.append(`<td class="expire ${isShort}">${untilText}</td>`);
      tableBody.append(row);
    });
  }
}
function formatDays(numberOfDays) {
  if (numberOfDays === 0) {
    return "Expired";
  } else if (numberOfDays >= 30) {
    const months = Math.floor(numberOfDays / 30);

    if (months === 1) {
      return `${months} Month`;
    } else {
      return `${months} Months`;
    }
  } else {
    return `${numberOfDays} days`;
  }
}
function checkAccess() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/check_permission.php",
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
