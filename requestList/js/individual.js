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
let empDetails = [];
let groupList = [];
let monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let monthNames2 = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const sampleData = [
  {
    req_id: 41,
    emp_name: "Apolinario, Timothy Jay",
    group_id: 16,
    requester_name: "",
    from: "2024-07-22",
    to: "2024-07-29",
    req_date: "2024-07-22",
    passValid: false,
    visaValid: false,
    status: null,
  },
  {
    req_id: 40,
    emp_name: "Apolinario, Timothy Jay",
    group_id: 16,
    requester_name: "",
    from: "2024-07-15",
    to: "2024-08-01",
    req_date: "2024-07-22",
    passValid: false,
    visaValid: false,
    status: 0,
  },
  {
    req_id: 39,
    emp_name: "Herrera, Rhanzces Julia",
    group_id: 16,
    requester_name: "Reyes, Dave",
    from: "2024-06-01",
    to: "2024-06-05",
    req_date: "2024-07-22",
    passValid: false,
    visaValid: false,
    status: null,
  },
  {
    req_id: 38,
    emp_name: "Reyes, Dave",
    group_id: 16,
    requester_name: "Reyes, Dave",
    from: "2024-05-01",
    to: "2024-05-03",
    req_date: "2024-07-19",
    passValid: false,
    visaValid: false,
    status: null,
  },
  {
    req_id: 37,
    emp_name: "Coquia, Joshua Mari",
    group_id: 16,
    requester_name: "Coquia, Joshua Mari",
    from: "2024-04-04",
    to: "2024-04-05",
    req_date: "2024-07-19",
    passValid: true,
    visaValid: true,
    status: 1,
  },
  {
    req_id: 36,
    emp_name: "Reyes, Dave",
    group_id: 16,
    requester_name: "Reyes, Dave",
    from: "2024-03-27",
    to: "2024-03-30",
    req_date: "2024-07-19",
    passValid: false,
    visaValid: false,
    status: null,
  },
  {
    req_id: 35,
    emp_name: "Coquia, Joshua Mari",
    group_id: 16,
    requester_name: "Reyes, Dave",
    from: "2024-02-21",
    to: "2024-03-01",
    req_date: "2024-07-19",
    passValid: true,
    visaValid: true,
    status: null,
  },
  {
    req_id: 34,
    emp_name: "Cabiso, Sean Patrick",
    group_id: 16,
    requester_name: "Reyes, Dave",
    from: "2024-09-25",
    to: "2024-09-27",
    req_date: "2024-07-19",
    passValid: false,
    visaValid: false,
    status: null,
  },
  {
    req_id: 30,
    emp_name: "Coquia, Joshua Mari",
    group_id: 16,
    requester_name: "",
    from: "2024-04-27",
    to: "2024-04-28",
    req_date: "2024-07-19",
    passValid: true,
    visaValid: true,
    status: null,
  },
  {
    req_id: 29,
    emp_name: "Reyes, Dave",
    group_id: 16,
    requester_name: "Reyes, Dave",
    from: "2024-06-05",
    to: "2024-06-18",
    req_date: "2024-07-19",
    passValid: false,
    visaValid: false,
    status: null,
  },
];
//#endregion
checkAccess()
  .then((emp) => {
    if (emp.isSuccess) {
      empDetails = emp.data;
      $(document).ready(function () {
        fillEmployeeDetails();
        $(".tab")[0].click();
        fillTable(sampleData);
        Promise.all([getGroups()])
          .then(([grps]) => {
            groupList = grps;
            fillGroups(groupList);
          })
          .catch((error) => {
            alert(`${error}`);
          });
      });
    } else {
      alert(emp.message);
      window.location.href = `${rootFolder}`;
    }
  })
  .catch((error) => {
    alert(`${error}`);
  });
//#region BINDS
$(document).on("click", "#menu", function () {
  $(".navigation").addClass("open");
  $("body").addClass("overflow-hidden");
});
$(document).on("click", "#closeNav", function () {
  $(".navigation").removeClass("open");
  $("body").removeClass("overflow-hidden");
});

$(document).on("change", "#grpSel", function () {
  var sel = $("#grpSel option:selected").text();
  var grp = $(this).val().split(",").length;

  $("#lblGrp").text(sel);
  console.log(grp);
  if (grp === 1) {
    $(this).addClass("active");
  } else {
    $(this).removeClass("active");
  }
  toggleLoadingAnimation(true);
});

$(document).on("change", "#monthSel", function () {
  var [year, month] = $(this).val().split("-");
  $(this).addClass("active");

  var monthName = monthNames[parseInt(month) - 1];
  $(".monthCont").html(`<i class='bx bx-calendar'></i>
                      <span class="" id="monthLabel">${monthName} ${year}</span>
                      <i class='bx bx-x text-[18px] ml-3 z-[100]' id="removeMonth"></i>`);
});
$(document).on("click", "#removeMonth", function () {
  $("#monthSel").removeClass("active");
  $(".monthCont").html(`<i class='bx bx-calendar'></i>
                      <span class="" id="monthLabel">Requested Month</span>
                      <i class='bx bx-chevron-down text-[18px] ml-3'></i>`);
});
// $(document).on("click", "#btnExport", function () {
//   exportTable();
// });
$(document).on("click", "#portalBtn", function () {
  window.location.href = `${rootFolder}`;
});
$(document).on("click", ".tab", function () {
  var indicator = document.querySelector(".indicator");
  var tabTarget = $(this).attr("aria-controls");
  console.log(tabTarget);
  var $panels = $(".tab-panel");
  var $this = $(this);
  var rect = $this[0].getBoundingClientRect(); // Convert jQuery object to DOM element
  var parentRect = $this.parent()[0].getBoundingClientRect(); // Convert parent jQuery object to DOM element

  indicator.style.width = rect.width + "px";
  indicator.style.left = rect.left - parentRect.left + "px";
  $(".tab span").removeClass("font-semibold text-[var(--dark)]");
  $(this).find("span").addClass("font-semibold text-[var(--dark)]");

  // $panels.each(function () {
  //   let panelId = $(this).attr("id");
  //   if (tabTarget === panelId) {
  //     $(this).removeClass("invisible opacity-0");
  //     $(this).addClass("visible opacity-100");
  //   } else {
  //     $(this).addClass("invisible opacity-0");
  //     $(this).removeClass("visible opacity-100");
  //   }
  // });
});
$(document).on("click", "td", function () {
  var rowID = $(this).closest("tr").attr("req-id");
  fillOpenModal(rowID);
});
$(document).on("click", "#openModal .btn-close", function () {
  $("#openModal").modal("hide");
});

//#endregion

//#region FUNCTIONS
function fillOpenModal(trID) {
  // var name,
  //   grp,
  //   passValidity,
  //   visaValidity,
  //   startDate,
  //   endDate,
  //   location,
  //   reqName,
  //   reqGrp,
  //   reqDate,
  //   status = "";

  const req = sampleData.find((req) => req.req_id == trID);
  const name = req.emp_name;
  const grp = req.group_id;
  const passValidity = req.passValid;
  const visaValidity = req.visaValid;
  const startDate = req.from;
  const endDate = req.to;
  const reqName = req.requester_name;
  const reqDate = req.req_date;
  const status = req.status;

  formatStatus(status);
  formatVisaPassport(visaValidity, passValidity);
  $("#modalEmpName").text(name);
  $("#modalGroup").text(grp);
  $("#modalDateFrom").text(formatDate(startDate));
  $("#modalDateTo").text(formatDate(endDate));
  $("#modalReqName").text(reqName);
  $("#modalReqDate").text(formatDate(reqDate));
  formatButtons(status);
  $("#openModal").modal("show");
}
function formatButtons(status) {
  $("#openModal .modal-footer").remove();
  if (status === null) {
    $("#openModal .modal-content")
      .append(`<div class="flex-nowrap modal-footer  flex gap-2 border-0 ">
        <button
          class=" rounded-lg px-3 py-2 text-[var(--white)] bg-[var(--dark)] hover:bg-[var(--dark-200)] transition w-50">Reject</button>
        <button
          class=" bg-[var(--secondary)] hover:bg-[var(--tertiary)] font-semibold rounded-lg px-3 py-2 w-50 text-[var(--dark)]">Accept</button>
      </div>`);
  } else {
    $("#openModal .modal-footer").remove();
  }
}
function formatDate(date) {
  var [year, month, day] = date.split("-");
  monthName = monthNames2[parseInt(month) - 1];

  return day + " " + monthName + " " + year;
}
function formatStatus(status) {
  let statusString =
    status === null ? "pending" : status === 1 ? "accepted" : "cancelled";
  $("#titleModal").html(
    `  Dispatch Request<span class="status lg ${statusString} ms-3">${statusString}</span>`
  );
}
function formatVisaPassport(visa, passport) {
  function updateModal(id, isValid) {
    const iconClass = isValid
      ? "bx-check text-[var(--darkest-100)]"
      : "bx-x text-[var(--red-200)]";
    const className = isValid
      ? "text-[var(--darkest-100)]"
      : "text-[var(--red-200)]";
    const statusText = isValid ? "Valid" : "Invalid";
    $(id).html(`
      <i class='bx ${iconClass} text-[18px]'></i>
      <p class="text-[14px] ${className}">${statusText} ${
      id === "#modalPassport" ? "Passport" : "Visa"
    }</p>
    `);
  }

  updateModal("#modalPassport", passport);
  updateModal("#modalVisa", visa);
}

function fillTable(sampleData) {
  var str = "";
  $.each(sampleData, function (index, item) {
    str = `
    <tr req-id="${item.req_id}">
      <td>${item.emp_name}</td>
      <td>${formatDate(item.req_date)}</td>
      <td>${formatDate(item.from)}</td>
      <td>${formatDate(item.to)}</td>
      <td>${item.requester_name}</td>
      <td>${
        item.status === null
          ? ` <span class=" status pending ">
                        Pending
                      </span>`
          : item.status === 1
          ? `  <span class=" status accepted ">
                        Accepted
                      </span>`
          : `<span class=" status cancelled ">
                        Cancelled
                      </span>`
      }</td>
      <td>${
        item.passValid === true
          ? `  <span class="validity "><i class='bx bx-check text-[18px]   font-semibold'></i></span>`
          : ` <span class="validity "><i class='bx bx-x text-[18px] font-semibold'></i></span>`
      }</td>
        <td>${
          item.visaValid === true
            ? `  <span class="validity "><i class='bx bx-check text-[18px]   font-semibold'></i></span>`
            : ` <span class="validity "><i class='bx bx-x text-[18px] font-semibold'></i></span>`
        }</td>
      <td>
        <div class="openIcon ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"   width="144px" height="144px">
            <path d="M 41.470703 4.9863281 A 1.50015 1.50015 0 0 0 41.308594 5 L 27.5 5 A 1.50015 1.50015 0 1 0 27.5 8 L 37.878906 8 L 22.439453 23.439453 A 1.50015 1.50015 0 1 0 24.560547 25.560547 L 40 10.121094 L 40 20.5 A 1.50015 1.50015 0 1 0 43 20.5 L 43 6.6894531 A 1.50015 1.50015 0 0 0 41.470703 4.9863281 z M 12.5 8 C 8.3754991 8 5 11.375499 5 15.5 L 5 35.5 C 5 39.624501 8.3754991 43 12.5 43 L 32.5 43 C 36.624501 43 40 39.624501 40 35.5 L 40 25.5 A 1.50015 1.50015 0 1 0 37 25.5 L 37 35.5 C 37 38.003499 35.003499 40 32.5 40 L 12.5 40 C 9.9965009 40 8 38.003499 8 35.5 L 8 15.5 C 8 12.996501 9.9965009 11 12.5 11 L 22.5 11 A 1.50015 1.50015 0 1 0 22.5 8 L 12.5 8 z" fill="rgba(85, 85, 85, 0.5)"  stroke="rgba(85, 85, 85, 0.5)" stroke-width="1"/>
          </svg>
        </div>
      </td>
    </tr>`;

    $("#tableBody").append(str);
  });
}

function getGroups() {
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "php/get_groups.php",
      dataType: "json",
      success: function (response) {
        // console.log(response);
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
  const groupIDS = grps.map((obj) => obj.newID);
  var grpSelect = $("#grpSel");
  grpSelect.html(`<option value=${groupIDS.toString()}>All Groups</option>`);
  $.each(grps, function (index, item) {
    var option = $("<option>")
      .attr("value", item.newID)
      .text(item.abbreviation)
      .attr("grp-id", item.newID);
    grpSelect.append(option);
  });
}
function checkAccess() {
  // const response = {
  //   isSuccess: true,
  //   data: {
  //     empNum: 464,
  //     empGroup: {
  //       id: 21,
  //       name: "System Group",
  //       acr: "SYS",
  //     },
  //     empName: {
  //       firstname: "Collene Keith",
  //       surname: "Medrano",
  //     },
  //   },
  // };
  // const response = {
  //   isSuccess: false,
  //   message: "Access Denied",
  // };
  // const response = {
  //   isSuccess: false,
  //   message: "Not logged in",
  // };
  return new Promise((resolve, reject) => {
    $.ajax({
      type: "GET",
      url: "../global/check_login.php",
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
          reject("An unspecified error occurred.1");
        }
      },
    });
    // resolve(response);
  });
}
function fillEmployeeDetails() {
  const fName = empDetails.empname.firstname;
  const sName = empDetails.empname.surname;
  const initials = getInitials(fName, sName);
  const grpName = empDetails.group;
  $("#empLabel").html(`${fName} ${sName}`);
  $("#empInitials").html(`${initials}`);
  $("#grpLabel").html(`${grpName}`);
}
function getInitials(firstname, surname) {
  let initials = "";
  var firstInitial = firstname.charAt(0);
  var lastInitial = surname.charAt(0);
  initials = `${firstInitial}${lastInitial}`;
  return initials.toUpperCase();
}

function exportTable() {
  const yr = $("#yearSel").val();
  TableToExcel.convert(document.getElementById("repTable"), {
    name: `Dispatch_Report_${yr}.xlsx`,
    sheet: {
      name: `${yr}`,
    },
  });
}
function toggleLoadingAnimation(show) {
  if (show) {
    $("#appendHere").append(`
          <div class="top-0 backdrop-blur-sm bg-gray/30 h-full flex justify-center items-center flex-col pb-5 absolute w-full" id="loadingAnimation">
              <div class="relative">
                  <div class="grayscale-[70%] w-[400px]">
                      <img src="../images/Frame 1.gif" alt="loader" class="w-full" />
                  </div>
                  <div class="absolute bottom-0 flex-col w-full text-center flex justify-center items-center gap-2">
                      <div class="title fw-semibold fs-5">
                          Loading data . . .
                      </div>
                      <div class="text">
                          Please wait while we fetch the dispatch report details.
                      </div>
                  </div>
              </div>
          </div>
      `);
  } else {
    $("#loadingAnimation").remove();
  }
}
//#endregion
