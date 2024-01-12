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
const dispTableID = ["eList", "eListNon"];
//#endregion
createTable()
checkAccess()
  .then((acc) => {
    if (acc) {
      $(document).ready(function () {
        Promise.all([getGroups(), getEmployees()])
          .then(([grps, emps]) => {
            fillGroups(grps);
            fillEmployees(emps);
          })
          .catch((error) => {
            alert(`${error}`);
          });
        mainHeight();
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

$(window).on("resize", function () {
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

$(document).on("change", "#grpSel", function () {
  getEmployees()
    .then((emps) => {
      fillEmployees(emps);
    })
    .catch((error) => {
      alert(`${error}`);
    });
    createTable();
});
// $(document).on("input", "#empSearch", function () {
//   getEmployees()
//     .then((emps) => {
//       fillEmployees(emps);
//     })
//     .catch((error) => {
//       alert(`${error}`);
//     });
// });

//#endregion

//#region FUNCTIONS
function createTable(){
  const myData = [{
    "id": 212,
    "empName": "LAZARO, Edmon",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 355,
    "empName": "DE JESUS, Jommuel",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 464,
    "empName": "COQUIA, Joshua Mari",
    "groupName": "SYS",
    "visaExpiry": "2028-02-07",
    "dispatch": [
        {
            "dispatch_from": "24 Jan 2024",
            "dispatch_to": "14 Feb 2024",
            "duration": 22
        },
        {
            "dispatch_from": "01 Mar 2024",
            "dispatch_to": "15 Mar 2024",
            "duration": 15
        }
    ],
    "totalDays": 37
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
}
,

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},

{
    "id": 487,
    "empName": "MEDRANO, Collene Keith",
    "groupName": "SYS",
    "visaExpiry": 123,
    "dispatch": [
        {
            "dispatch_from": "13 Oct 2023",
            "dispatch_to": "01 Jan 2024",
            "duration": 0
        }
    ],
    "totalDays": 0
},
{
    "id": 498,
    "empName": "CERDAN JR., Tagumpay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 510,
    "empName": "HERNANDEZ, Dexmel Mico",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 511,
    "empName": "APOLINARIO, Timothy Jay",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
},
{
    "id": 513,
    "empName": "ALANO, Adrian William",
    "groupName": "SYS",
    "visaExpiry": null,
    "dispatch": [],
    "totalDays": 0
}];
myData.forEach(element => {
  var ele = $(element.dispatch)
  var rspan = ele.length;
  var visa = $(element.visaExpiry);
  if (visa === null){
    visa = `wala`;
  }
  else{
    visa = $(element.visaExpiry);
  }
  var str = "";
var deets = `
<td rowspan="${rspan}">${element.empName}</td>
<td rowspan="${rspan}">${element.groupName}</td>
<td rowspan="${rspan}">${element.visaExpiry || "-"}</td>
`;
var tot = `
<td rowspan="${rspan}">${element.totalDays}</td>
`;

if(rspan===0){
str+=`
<tr>
  <td rowspan="1">${element.empName}</td>
  <td rowspan="1">${element.groupName}</td>
  <td rowspan="1">${element.visaExpiry || "-"}</td>
  <td>-</td>
  <td>-</td>
  <td>-</td>
  <td rowspan="1">-</td>
</tr>
`;
}
else{
  element.dispatch.forEach((dispData,index) => {
    var dDeets='';
    var dTot='';
    if(index===0){
      dDeets=deets;
      dTot=tot;
    }
    str+=`<tr>
    ${dDeets}
    <td>${dispData.dispatch_from}</td>
    <td>${dispData.dispatch_to}</td>
    <td>${dispData.duration}</td>
    ${dTot}
    </tr>`;
  });
}

$("#dataHere").append(str)
});
}
function mainHeight() {
  var title = $(".pageTitle").css("height");

  $(".main").css("height", `calc(100vh - ${title}`);
  // console.log(title);
}
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
      .text(item.abbreviation)
      .attr("grp-id", item.id);
    grpSelect.append(option);
  });
}
function getEmployees() {
  const grpID = $("#grpSel").find("option:selected").attr("grp-id");
  const disp = $(".title.first").hasClass("active") ? 1 : 0;
  const keyword = $("#empSearch").val();
  dispatch_days = 0;
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "POST",
      url: "php/get_employee_list.php",
      data: {
        groupID: grpID,
        dispatch: disp,
        searchkey: keyword,
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
  var tableFD = $("#eList");
  var tableND = $("#eListNon");
  tableFD.empty();
  tableND.empty();
  $.each(emps, function (index, item) {
    var row = $(`<tr d-id=${item.empID}>`);
    row.append(`<td>${item.empID}</td>`);
    row.append(`<td>${item.firstname} ${item.lastname}</td>`);
    row.append(`<td>${item.groupAbbr}</td>`);
    row.append(`<td>${item.passportExpiry}</td>`);
    row.append(`<td>${item.visaExpiry}</td>`);
    row.append(
      `<td><i class="bx bxs-user-detail fs-5 seeMore" id=${item.empID}></i></td>`
    );

    if (item.dispatch == 1) {
      tableFD.append(row);
    } else {
      tableND.append(row);
    }
  });
  dispTableID.forEach((element) => {
    checkEmpty(element);
  });
}
function checkEmpty(tbodyID) {
  var tbodySelector = "#" + tbodyID;
  if ($(tbodySelector + " tr").length === 0) {
    var newRow = `<tr><td colspan="6" class="text-center">No data found</td></tr>`;
    $(tbodySelector).append(newRow);
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
