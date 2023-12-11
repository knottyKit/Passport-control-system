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
//#endregion

//#region BINDS
$(document).ready(function () {
  Promise.all([getDispatchlist(), getExpiringPassport(), getExpiringVisa()])
    .then(([dList, epList, evList]) => {
      fillDispatchList(dList);
      fillPassport(epList);
      fillVisa(evList);
    })
    .catch((error) => {
      alert(`${error}`);
    });
});
$(document).on("change", "#idYear", function () {
  getDispatchlist()
    .then((dList) => {
      fillDispatchList(dList);
    })
    .catch((error) => {
      alert(`${error}`);
    });
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
      var row = $("<tr>");
      row.append(`<td>${item.name}</td>`);
      row.append(`<td>${item.location}</td>`);
      row.append(`<td>${item.from}</td>`);
      row.append(`<td>${item.to}</td>`);
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
      var row = $("<tr>");
      var untilText = item.until === 1 ? "1 Month" : item.until + " Months";
      var isShort = item.until < 10 ? "short" : "";
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
      var row = $("<tr>");
      var untilText = item.until === 1 ? "1 Month" : item.until + " Months";
      var isShort = item.until < 7 ? "short" : "";
      row.append(`<td>${item.name}</td>`);
      row.append(`<td class="expire ${isShort}">${untilText}</td>`);
      tableBody.append(row);
    });
  }
}
//#endregion
