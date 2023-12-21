import { HttpClient } from "./http-client.service.js";

const client = new HttpClient();
const ticketNavLink = document.querySelectorAll(".ticket_nav_link");
const activityNavLink = document.querySelectorAll(".activity_nav_link");
const commentsNavLink = document.querySelectorAll(".comments_nav_link");
const userNavLink = document.querySelectorAll(".user_nav_link");
const singleCheckbox = document.querySelectorAll(".single-ticket-checkbox");
const tableRows = document.querySelectorAll(".ticket-rows");
const createUser = document.querySelector(".create-user");
const first_name = document.querySelector("#first_name");
const last_name = document.querySelector("#last_name");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const abbreviation = document.querySelector("#abbreviation");
const feedbackUpdate = document.forms.feedbackUpdate;

// current variable is to increase ticket details three by three
let current_div = 3;

if (createUser != undefined) {
  [first_name, last_name, email, password, abbreviation].forEach((element) => {
    element.addEventListener("click", (event) => {
      element.classList.remove("is-invalid");
      if (element.type == "password") {
        document
          .querySelector("#show-password")
          .classList.remove("password-error");
      }
    });
  });

  createUser.addEventListener("click", (event) => {
    const company = document.querySelector("#company").value;
    const admin = document.querySelector("#admin").checked;

    var isError = false;
    [first_name, last_name, email, password, abbreviation].forEach(
      (element) => {
        if (element.value.trim() == "") {
          isError = true;
          element.classList.add("is-invalid");
          if (element.type == "password") {
            document
              .querySelector("#show-password")
              .classList.add("password-error");
          }
        }
      }
    );
    if (isError) {
      return false;
    }

    client.post(
      "/api/user/create",
      JSON.stringify({
        company: company,
        first_name: first_name.value,
        last_name: last_name.value,
        email: email.value,
        password: password.value,
        abbreviation: abbreviation.value,
        admin: admin,
      }),
      (response, request) => {
        if (request.status != 200) {
          response = JSON.parse(response);
          showErrorMessage(response);
        } else {
          location.reload();
        }
      }
    );
  });
}
let feedbackNavLink = document.querySelectorAll(".feedback_nav_link");
if (feedbackNavLink != undefined) {
  feedbackNavLink.forEach((element) => {
    element.addEventListener("click", (event) => {
      var pageToLoad = event.target.getAttribute("data-feedbackpagetoload");
      document.querySelector("#feedbackPage").value = pageToLoad;
      document.querySelector("#feedbackDataForm").submit();
    });
  });
}

let feedbackActivityNavLink = document.querySelectorAll(
  ".feedback_activity_nav_link"
);
if (feedbackActivityNavLink != undefined) {
  feedbackActivityNavLink.forEach((element) => {
    element.addEventListener("click", (event) => {
      var pageToLoad = event.target.getAttribute(
        "data-feedbackactivitypagetoload"
      );
      document.querySelector("#feedbackActivityPage").value = pageToLoad;
      document.querySelector("#feedbackDataForm").submit();
    });
  });
}

if (ticketNavLink != undefined) {
  ticketNavLink.forEach((element) => {
    element.addEventListener("click", (event) => {
      var pageToLoad = event.target.getAttribute("data-pagetoload");
      document.querySelector("#page").value = pageToLoad;
      document.querySelector("#ticket_form").submit();
    });
  });
}

if (activityNavLink != undefined) {
  activityNavLink.forEach((element) => {
    element.addEventListener("click", (event) => {
      var pageToLoad = event.target.getAttribute("data-pagetoload");
      document.querySelector("#activityPage").value = pageToLoad;
      document.querySelector("#activityForm").submit();
    });
  });
}

if (commentsNavLink != undefined) {
  commentsNavLink.forEach((element) => {
    element.addEventListener("click", (event) => {
      var pageToLoad = event.target.getAttribute("data-pagetoload");
      document.querySelector("#commentPage").value = pageToLoad;
      document.querySelector("#commentsForm").submit();
    });
  });
}

if (userNavLink != undefined) {
  userNavLink.forEach((element) => {
    element.addEventListener("click", (event) => {
      var pageToLoad = event.target.getAttribute("data-pagetoload");
      document.querySelector("#page").value = pageToLoad;
      document.querySelector("#users_form").submit();
    });
  });
}

if (tableRows != undefined) {
  document.querySelectorAll(".ticket-rows").forEach((row) => {
    row.addEventListener("click", (event) => {
      var ticketId = event.target.parentElement.getAttribute("data-ticket-id");
      if (ticketId != null && ticketId != undefined) {
        window.location.replace("/tickets/detail/" + ticketId);
      }
    });
  });
}

if (document.querySelector("#submit_filter_form_button") != undefined) {
  document
    .querySelector("#submit_filter_form_button")
    .addEventListener("click", (event) => {
      console.log("hsdfd");
      document.querySelector("#page").value = 1;
      document.querySelector("#ticket_form").submit();
    });
}

if (
  document.querySelector("#submit_feedback_filter_form_button") != undefined
) {
  document
    .querySelector("#submit_feedback_filter_form_button")
    .addEventListener("click", (event) => {
      console.log("filter");
      document.querySelector("#feedbackPage").value = 1;
      document.querySelector("#feedbackDataForm").submit();
    });
}

if (document.querySelector("#feedback_show_list") != undefined) {
  document
    .querySelector("#feedback_show_list")
    .addEventListener("change", (e) => {
      document.querySelector("#feedbackPage").value = 1;
      document.querySelector("#feedbackDataForm").submit();
    });
}
if (document.querySelector("#reset_filter_form_button") != undefined) {
  document
    .querySelector("#reset_filter_form_button")
    .addEventListener("click", (event) => {
      [
        "ticket_no",
        "subject",
        "list_status",
        "list_priority",
        "list_assignees",
        "application",
        "server",
        "subTickets",
        "filter_date_range",
        "datepicker-icon-prepend",
      ].forEach((field) => {
        if (document.querySelector("#" + field) != undefined) {
          if (
            document.querySelector("#" + field).tagName.toLowerCase() == "input"
          ) {
            document.querySelector("#" + field).value = "";
          } else {
            document.querySelector("#" + field).value = 0;
          }
        }
      });
      document.querySelector("#page").value = 1;
      document.querySelector("#ticket_form").submit();
    });
}

if (document.querySelector("#reset_filter_feedback_button") != undefined) {
  document
    .querySelector("#reset_filter_feedback_button")
    .addEventListener("click", (event) => {
      ["feedback_list_status", "feedback-datepicker-icon-prepend"].forEach(
        (field) => {
          if (document.querySelector("#" + field) != undefined) {
            if (
              document.querySelector("#" + field).tagName.toLowerCase() ==
              "input"
            ) {
              document.querySelector("#" + field).value = "";
            } else {
              document.querySelector("#" + field).value = "All";
            }
          }
        }
      );
      document.querySelector("#feedbackPage").value = 1;
      document.querySelector("#feedbackDataForm").submit();
    });
}

if (document.querySelector("#filter-button") != undefined) {
  document
    .querySelector("#filter-button")
    .addEventListener("click", (event) => {
      if (document.querySelector(".filter-block").style.display == "none") {
        document.querySelector(".filter-block").style.display = "block";
      } else {
        document.querySelector(".filter-block").style.display = "none";
      }
    });
}

if (document.querySelector("#filter-button") != undefined) {
  document
    .querySelector(".all-ticket-checkbox")
    .addEventListener("click", (event) => {
      singleCheckbox.forEach((element) => {
        if (event.target.checked == true) {
          element.checked = true;
        } else {
          element.checked = false;
        }
      });
    });
}

if (document.querySelector(".subtickets-header") != undefined) {
  document
    .querySelector(".subtickets-header")
    .addEventListener("click", (event) => {
      if (document.querySelector(".subtickets-body").style.display == "none") {
        $(".subtickets-body").show("slow");
      } else {
        $(".subtickets-body").hide("slow");
      }
    });
}

let tickets_array = document.querySelectorAll(".show-tickets");

if (document.querySelector("#view_all_tickets") != undefined) {
  document.querySelector("#view_all_tickets").addEventListener("click", (e) => {
    if (document.querySelector(".view-text").innerText === "View all") {
      current_div;
    }
    if (document.querySelector(".view-text").innerText === "Hide all") {
      current_div = 3;
    }
    for (let i = current_div; i <= tickets_array.length; i++) {
      if (tickets_array[i]) {
        if (tickets_array[i].style.display === "block") {
          document.querySelector(".view-text").innerText = "View all";
          $("#eye_icon")
            .html(` <svg xmlns="http://www.w3.org/2000/svg"  class="icon icon-tabler icon-tabler-eye-off m-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                     <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                     <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                                    </svg>`);
          tickets_array[i].style.display = "none";
          document
            .querySelector("#view_more_tickets")
            .classList.remove("d-none");
          document.querySelector("#view_less_tickets").classList.add("d-none");
        } else {
          tickets_array[i].style.display = "block";
          document.querySelector(".view-text").innerText = "Hide all";
          $("#eye_icon")
            .html(`  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                         <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                                         <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
                                         <path d="M3 3l18 18"></path>
                                         </svg>`);
          document.querySelector("#view_more_tickets").classList.add("d-none");
          document.querySelector("#view_less_tickets").classList.add("d-none");
        }
      }
    }
  });
}

if (document.querySelector("#view_more_tickets") != undefined) {
  document
    .querySelector("#view_more_tickets")
    .addEventListener("click", (event) => {
      for (let i = current_div; i < current_div + 3; i++) {
        if (tickets_array[i]) {
          $(tickets_array[i]).fadeIn(1000);
        }
      }
      current_div += 3;
      $("html, body")
        .stop()
        .animate(
          {
            scrollTop: $(tickets_array[current_div - 3]).offset().top,
          },
          700,
          "swing"
        );
      if (current_div >= tickets_array.length) {
        document.querySelector("#view_more_tickets").classList.add("d-none");
        document.querySelector("#view_less_tickets").classList.remove("d-none");
        document.querySelector(".view-text").innerText = "Hide all";
        $("#eye_icon")
          .html(`  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                         <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                        <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828"></path>
                                        <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"></path>
                                        <path d="M3 3l18 18"></path>
                                        </svg>`);
      }
    });
}

if (document.querySelector("#view_less_tickets") != undefined) {
  let less = 3;
  document
    .querySelector("#view_less_tickets")
    .addEventListener("click", (e) => {
      document.querySelector(".view-text").innerText = "View all";
      $("#eye_icon")
        .html(` <svg xmlns="http://www.w3.org/2000/svg"  class="icon icon-tabler icon-tabler-eye-off m-0" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                               <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"></path>
                                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"></path>
                               </svg>`);
      for (let i = current_div - less; i < current_div; i++) {
        if (tickets_array[i]) {
          $(tickets_array[i]).fadeOut(1000);
        }
      }
      current_div -= less;
      if (current_div <= less) {
        document.querySelector("#view_less_tickets").classList.add("d-none");
        document.querySelector("#view_more_tickets").classList.remove("d-none");
      }
      $("html, body").animate(
        {
          scrollTop: $(tickets_array[current_div - 3]).offset().top - 100,
        },
        400
      );
    });
}

singleCheckbox.forEach((element) => {
  element.addEventListener("click", (event) => {
    if (element.checked == false) {
      document.querySelector(".all-ticket-checkbox").checked = false;
    } else {
      document.querySelector(".all-ticket-checkbox").checked = true;
    }
  });
});

["assignees", "status", "priority"].forEach((field) => {
  if (document.querySelector("#" + field) != undefined) {
    document.querySelector("#" + field).addEventListener("change", (event) => {
      if (
        confirm("Are you sure you want to change the " + field + " ?") == true
      ) {
        const ticketId = document.querySelector("#ticketId").value;
        var jsonData;
        if (field == "status") {
          var jsonData = {
            status: document.querySelector("#" + field).value,
          };
        } else if (field == "assignees") {
          var jsonData = {
            assignees: document.querySelector("#" + field).value,
          };
        } else {
          var jsonData = {
            priority: document.querySelector("#" + field).value,
          };
        }
        client.post(
          "/tickets/update/" + ticketId,
          JSON.stringify(jsonData),
          (response, request) => {
            location.reload();
          }
        );
      } else {
        text = "You canceled!";
      }
    });
  }
});

if (document.querySelector("#ticket_comments") != undefined) {
  document
    .querySelector("#ticket_comments")
    .addEventListener("focus", (event) => {
      document.querySelector("#ticket_comments").style.borderColor = "#dadfe5";
    });
}

if (document.querySelector("#addComment") != undefined) {
  document.querySelector("#addComment").addEventListener("click", (event) => {
    if (document.querySelector("#ticket_comments").value.trim() != "") {
      const ticketId = document.querySelector("#ticketId").value;
      client.post(
        "/tickets/addComments/" + ticketId,
        JSON.stringify({
          note: document.querySelector("#ticket_comments").value,
        }),
        (response, request) => {
          response = JSON.parse(response);
          if (request.status != 200) {
            $("#alert_failure_comments").show("slow");
            document.getElementById("comment_failure").innerText =
              response.message
                ? response.message
                : "some error occured during adding comment";
            setTimeout(() => {
              $("#alert_failure_comments").hide("slow");
            }, 1000);
          } else {
            $("#alert_success_comments").show("slow");
            document.getElementById("comment_success").innerText =
              response.message ? response.message : "comment added succefully";
            setTimeout(() => {
              $("#alert_success_comments").hide("slow");
              location.reload();
            }, 1000);
          }
        }
      );
    } else {
      document.querySelector("#ticket_comments").style.borderColor = "red";
    }
  });
}

$("#btn_close").click(() => {
  location.reload();
});

let feedback_type;
let feedback_type_checked = false;
let feedback_type_list = document.getElementsByName("feedback_type");
const fileInput = document.querySelector('input[name="files"]');

if (document.querySelector("#feedback_form") != undefined) {
  feedback_type_list.forEach((element) => {
    element.addEventListener("click", (e) => {
      const files = fileInput.files;
      if (e.target.checked) {
        if (files.length <= 5) {
          feedback_type = element.value;
          feedback_type_checked = true;
          if (
            !document
              .querySelector(".feedback-error-message")
              .classList.contains("invisible")
          ) {
            document
              .querySelector(".feedback-error-message")
              .classList.add("invisible");
          }
        } else {
          feedback_type = element.value;
          feedback_type_checked = true;
          document.querySelector(".feedback-error-message").innerText =
            "Only 5 Images are allowed";
        }
      }
    });
  });

  fileInput.addEventListener("change", (e) => {
    // console.log(e.target.files.length)
    if (e.target.files.length <= 5) {
      if (e.target.files.length <= 5 && feedback_type_checked === true) {
        if (
          !document
            .querySelector(".feedback-error-message")
            .classList.contains("invisible")
        ) {
          document
            .querySelector(".feedback-error-message")
            .classList.add("invisible");
        }
      }
      if (feedback_type_checked === false) {
        document.querySelector(".feedback-error-message").innerText =
          "Please select any one Feedback type";
      }
    }
  });

  document
    .querySelector("#feedback_form")
    .addEventListener("click", (event) => {
      const formData = new FormData();
      formData.append("note", document.querySelector("#user_feedback").value);
      formData.append("type", feedback_type);

      const files = fileInput.files;
      if (files.length > 5 && feedback_type_checked === false) {
        document
          .querySelector(".feedback-error-message")
          .classList.remove("invisible");
        document.querySelector(".feedback-error-message").innerText =
          "Please select any one Feedback type  Only 5 Images are allowed ";
      } else if (feedback_type_checked === false) {
        document
          .querySelector(".feedback-error-message")
          .classList.remove("invisible");
        document.querySelector(".feedback-error-message").innerText =
          "Please select any one Feedback type";
      } else if (files.length > 5) {
        document
          .querySelector(".feedback-error-message")
          .classList.remove("invisible");
        document.querySelector(".feedback-error-message").innerText =
          "Only 5 Images are allowed";
      }

      if (document.querySelector("#user_feedback").value.trim() == "") {
        document
          .querySelector("#user_feedback")
          .classList.add("error-animation");
        setTimeout(() => {
          document
            .querySelector("#user_feedback")
            .classList.remove("error-animation");
        }, 1000);
      }

      if (files.length <= 5) {
        for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);
        }
      }
      // formData.append('files', fileInput.files[0]);

      if (
        document.querySelector("#user_feedback").value.trim() != "" &&
        feedback_type_checked === true
      ) {
        if (files.length <= 5) {
          client.post("/feedback/post", formData, (response, request) => {
            response = JSON.parse(response);
            if (request.status == 200) {
              document
                .querySelector(".feedback-animation")
                .classList.add("success-animation");
              setTimeout(() => {
                window.location.reload();
              }, 1500);
            } else if (request.status == 400) {
              console.log("error");
              document
                .querySelector(".feedback-error-message")
                .classList.remove("invisible");
              document.querySelector(".feedback-error-message").innerText =
                response.errors;
            }
          });
        }
      }
    });


}

textAreaAutosize();

function textAreaAutosize() {
  var text = $("#user_feedback");
  text.each(function () {
    $(this).attr("rows", 1);
    resize($(this));
  });
  text.on("input", function () {
    resize($(this));
  });

  function resize($text) {
    $text.css("height", "auto");
    $text.css("height", $text[0].scrollHeight + "px");
  }
}

if (document.querySelector(".feedback-custom-btn2") != undefined) {
  document
    .querySelector(".feedback-custom-btn2")
    .addEventListener("click", () => {
      document.querySelector(".feedback-custom-btn2").classList.add("boom");
      setTimeout(() => {
        document
          .querySelector(".feedback-custom-btn2")
          .classList.remove("boom");
      }, 1000);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  var tooltip = new bootstrap.Tooltip(
    document.querySelector(".feedback-min-btn"),
    {
      placement: "top",
    }
  );

  document
    .querySelector(".feedback-min-btn")
    .addEventListener("click", function () {
      if (
        !document
          .querySelector(".feedback-min-max")
          .classList.contains("active")
      ) {
        document.querySelector(".feedback-min-max").classList.add("active");
        document
          .querySelector(".feedback-custom-btn")
          .classList.remove("hover");
      } else {
        document.querySelector(".feedback-min-max").classList.remove("active");
        setTimeout(() => {
          document.querySelector(".feedback-custom-btn").classList.add("hover");
        }, 1000);
      }

      if (tooltip._config.title === "Close Feedback") {
        tooltip._config.title = "Open Feedback";
      } else {
        tooltip._config.title = "Close Feedback";
      }

      setTimeout(() => {
        tooltip.hide();
      }, 10);

      // tooltip.show();
    });
});

$(".feedback-popout .feedback-custom-btn").click(function () {
  $(this).toggleClass("active");
  $(".feedback-popout .feedback-custom-btn2").removeClass("d-none");
  $(".feedback-min-btn").addClass("d-none");
  $(this)
    .closest(".feedback-popout")
    .find(".feedback-panel")
    .toggleClass("active");
});

$("#feedback_close_btn").click(function () {
  $(".feedback-popout .feedback-panel").removeClass("active");
  $(".feedback-popout .feedback-custom-btn2").addClass("d-none");
  $(".feedback-min-btn").removeClass("d-none");
  $(".feedback-popout .feedback-custom-btn").removeClass("active");
  if (
    !document
      .querySelector(".feedback-error-message")
      .classList.contains("invisible")
  ) {
    document
      .querySelector(".feedback-error-message")
      .classList.add("invisible");
  }
  document.querySelector("#user_feedback").value = "";
  document.querySelector('input[name="files"]').value = "";
  feedback_type_list.forEach((element) => {
    if (element.checked) {
      element.checked = false;
    }
    feedback_type_checked = false;
  });
});
$(".feedback-popout .feedback-panel").click(function (event) {
  event.stopPropagation();
});
$(".feedback-popout .feedback-custom-btn").click(function (event) {
  event.stopPropagation();
});


document.querySelectorAll(".view-feedback-text")?.forEach((element) => {
  element.addEventListener("click", (e) => {
    let id = e.target.closest(".feedback-row").children[1].innerText;
    client.get(`/feedback/${id}`, (response, request) => {
      response = JSON.parse(response);
      // console.log(response.data.feedback)
      document.querySelector(".check-modal").innerText = response.data.feedback;
    });
    $("#modal-view-text").modal("show");
  });
});

document.querySelectorAll(".show-full-feedback-image")?.forEach((element) => {
  element.addEventListener("click", (e) => {
    // console.log(e.target.getAttribute('data-feedback-id'))
    let id = e.target.getAttribute("data-feedback-id");
    client.get(`/feedback/${id}`, (response, request) => {
      response = JSON.parse(response);

      const modalBody = document.querySelector(".modal-append");
      modalBody.innerHTML = "";

      const imageFiles = response.data.image.trim().split(",");
      imageFiles.forEach((imageName) => {
        const divElement = document.createElement("div");
        divElement.classList.add("d-block", "w-100");
        const figureElement = document.createElement("figure");
        figureElement.classList.add("zoom", "d-block", "mx-auto", "mb-0");
        figureElement.style.backgroundImage = `url(img/${imageName})`;
        const imgElement = document.createElement("img");
        imgElement.src = `img/${imageName}`;
        imgElement.alt = "Image";
        imgElement.classList.add("img-1");
        imgElement.setAttribute("data-bs-toggle", "tooltip");
        imgElement.setAttribute("data-bs-placement", "top");
        imgElement.setAttribute("data-bs-title", "Click on image to download");
        imgElement.setAttribute("data-bs-zoom", "true");
        imgElement.classList.add("d-block", "mx-auto", "feedback-image");
        divElement.append(figureElement);
        figureElement.append(imgElement);
        modalBody.appendChild(divElement);
        const downloadLink = document.createElement("a");
        downloadLink.href = `img/${imageName}`;
        downloadLink.download = imageName;
        downloadLink.textContent = "";
        downloadLink.style.display = "none";

        modalBody.appendChild(downloadLink);

        imgElement.addEventListener("click", () => {
          downloadLink.click();
        });
        new bootstrap.Tooltip(imgElement);

        modalBody.appendChild(document.createElement("br"));
      });
      document.querySelectorAll(".zoom").forEach((ele) => {
        ele.addEventListener("mousemove", (e) => {
          let offsetX;
          let offsetY;
          let x;
          let y;
          var zoomer = e.currentTarget;
          if (e.target.naturalWidth >= 500) {
            offsetX = e.offsetX
              ? e.offsetX
              : e.touches
              ? e.touches[0].pageX
              : null;
            offsetY = e.offsetY
              ? e.offsetY
              : e.touches
              ? e.touches[0].pageX
              : null;
            x = (offsetX / zoomer.offsetWidth) * 100;
            y = (offsetY / zoomer.offsetHeight) * 100;
            zoomer.style.backgroundPosition = x + "% " + y + "%";
          }
        });
      });
    });

    $("#modal-view-image").modal("show");
  });
});

if (document.querySelector(".feedback-delete-button") !== undefined) {
  document.querySelectorAll(".feedback-delete-button").forEach((element) => {
    element.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-feedback-id");
      document
        .querySelector("#feedback_modal_delete_button")
        ?.addEventListener("click", () => {
          client.delete(
            "/feedback/delete",
            JSON.stringify({
              id: id,
            }),
            (response, request) => {
              response = JSON.parse(response);
              console.log(response);
              if (request.status == 200) {
                $("#feedback_delete_success").show("slow");
                $("#feedback_delete_success_text").text(
                  response.message
                    ? response.message
                    : `feedback deleted successfully`
                );
                setTimeout(() => {
                  $("#feedback_delete_success").hide("slow");
                  window.location.reload();
                }, 1500);
              } else {
                $("#feedback_delete_failure").show("slow");
                $("#feedback_delete_failure_text").text(
                  response.message ? response.message : `some error occured`
                );
                setTimeout(() => {
                  $("#feedback_delete_failure").hide(1500);
                }, 1000);
              }
            }
          );
        });
    });
  });
}

if (document.querySelector(".feedback-edit-button") !== undefined) {
  document.querySelectorAll(".feedback-edit-button").forEach((element) => {
    element.addEventListener("click", (e) => {
      const id = e.target.getAttribute("data-feedback-id");
      const status = e.target.innerText;
      console.log(id, e.target.innerText);
      $("#modal_edit_feedback").modal("show");
      if (document.querySelector("#feedback_modal_edit_button")) {
        document
          .querySelector("#feedback_modal_edit_button")
          .addEventListener("click", () => {
            client.patch(
              "/feedback/patch",
              JSON.stringify({
                id: id,
                status: status,
              }),
              (response, request) => {
                response = JSON.parse(response, request);
                // console.log(response)
                if (request.status == 200) {
                  $("#feedback_update_success").show("slow");
                  $("#feedback_update_success_text").text(
                    response.message
                      ? response.message
                      : `feedback updated successfully`
                  );
                  setTimeout(() => {
                    $("#feedback_update_success").hide("slow");
                    window.location.reload();
                  }, 1500);
                } else {
                  $("#feedback_update_failure").show("slow");
                  $("#feedback_update_failure_text").text(
                    response.message ? response.message : `some error occured`
                  );
                  setTimeout(() => {
                    $("#feedback_update_failure").hide(1500);
                  }, 1000);
                }
              }
            );
          });
      }
    });
  });
}

function sortTableByColumn(table, column, asc = true) {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  // Sort each row
  const sortedRows = rows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    // Convert values to numbers for numeric columns
    const aValue = isNaN(aColText) ? aColText : parseFloat(aColText);
    const bValue = isNaN(bColText) ? bColText : parseFloat(bColText);

    return aValue > bValue
      ? 1 * dirModifier
      : aValue < bValue
      ? -1 * dirModifier
      : 0;
  });

  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
}

[
  "table-sort th:nth-child(7)",
  "table-sort th:nth-child(2)",
  "table-sort th:nth-child(3)",
  "table-sort th:nth-child(6)",
].forEach((field) => {
  document.querySelectorAll(`#${field}`).forEach((headerCell) => {
    headerCell.addEventListener("click", () => {
      const tableElement = headerCell.parentElement.parentElement.parentElement;
      const headerIndex = Array.prototype.indexOf.call(
        headerCell.parentElement.children,
        headerCell
      );
      const currentIsAscending = headerCell.classList.contains("th-sort-asc");

      sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
    });
  });
});

if (document.querySelector(".feedback-email-button") != undefined) {
  document.querySelectorAll(".feedback-email-button").forEach((element) => {
    let count = 0;
    element.addEventListener("click", (e) => {
      count++;
      let feedback_category =
        e.currentTarget.closest(".feedback-row").children[2].innerText;
      let assignee_id = e.currentTarget.getAttribute("data-assigneeid");
      let feedback_id = e.currentTarget.getAttribute("data-feedback-id");
      e.currentTarget.children[0].classList.remove("d-none");
      e.currentTarget.children[1].classList.add("d-none");
      if (count == 1) {
        if (!e.currentTarget.disabled) {
          client.post(
            "feedback/email",
            JSON.stringify({
              category: feedback_category,
              id: assignee_id,
            }),
            (response, request) => {
              response = JSON.parse(response);
              if (request.status != 200) {
                $("#feedback_mail_failure").show("slow");
                document.getElementById("mail_failure_text").innerText =
                  response.message ? response.message : "Some error occured";
                setTimeout(() => {
                  $("#feedback_mail_failure").hide("slow");
                }, 2000);
              } else {
                $("#feedback_mail_sent_success").show("slow");
                document.getElementById("mail_success_text").innerText =
                  response.message ? response.message : "Email sent succefully";
                setTimeout(() => {
                  $("#feedback_mail_sent_success").hide("slow");
                }, 2000);

                client.patch(
                  "/feedback/patch",
                  JSON.stringify({
                    id: feedback_id,
                    isdisabled: 1,
                  }),
                  (response, request) => {
                    response = JSON.parse(response, request);
                    if (request.status == 200) {
                      setTimeout(() => {
                        window.location.reload();
                      }, 2100);
                    }
                  }
                );
              }
            }
          );
        }
      }
    });
  });
}

if (document.querySelector("#feedback-datepicker-icon-prepend")) {
  document.addEventListener("DOMContentLoaded", function () {
    var calender_ele = new Litepicker({
      element: document.getElementById("feedback-datepicker-icon-prepend"),
      tooltipText: {
        one: "day",
        other: "days",
      },
      dropdowns: {
        months: true,
      },
      tooltipNumber: (totalDays) => {
        return totalDays;
      },
      buttonText: {
        previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="15 6 9 12 15 18" /></svg>`,
        nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18" /></svg>`,
      },
      singleMode: false,
      numberOfMonths: 2,
      numberOfColumns: 2,
      selectForward: true,
      selectBackward: false,
      format: "DD.MM.YYYY",
      maxDate: new Date(),
      startDate: new Date(),
      firstDay: 1,
    });
    calender_ele.render();
  });
}

if (document.querySelectorAll(".table-sort") != undefined) {
  document.querySelectorAll(".table-sort").forEach((element) => {
    element.addEventListener("click", (event) => {
      if (document.querySelector("#sortField") != undefined) {
        document.querySelector("#sortField").value =
          event.target.getAttribute("data-fieldname");
        if (document.querySelector("#sortBy").value == "DESC") {
          document.querySelector("#sortBy").value = "ASC";
        } else {
          document.querySelector("#sortBy").value = "DESC";
        }
        document.querySelector("#ticket_form").submit();
      }
    });
  });
}

if (document.getElementById("datepicker-icon-prepend")) {
  document.addEventListener("DOMContentLoaded", function () {
    if (window.Litepicker) {
      var calender_ele = new Litepicker({
        element: document.getElementById("datepicker-icon-prepend"),
        tooltipText: {
          one: "day",
          other: "days",
        },
        dropdowns: {
          months: true,
        },
        tooltipNumber: (totalDays) => {
          return totalDays;
        },
        buttonText: {
          previousMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="15 6 9 12 15 18" /></svg>`,
          nextMonth: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="9 6 15 12 9 18" /></svg>`,
        },
        singleMode: false,
        numberOfMonths: 2,
        numberOfColumns: 2,
        selectForward: true,
        selectBackward: false,
        format: "DD.MM.YYYY",
        maxDate: new Date(),
        startDate: new Date(),
        firstDay: 1,
      });
      calender_ele.render();
    }
  });
}

if (document.querySelector("#filter_date_range") != undefined) {
  document
    .querySelector("#filter_date_range")
    .addEventListener("change", (event) => {
      let filter_date_range = event.target.value;
      document.querySelector(".filter_date").value = "";

      if (filter_date_range === "today") {
        document.querySelector(".filter_date").value =
          get_today_date() + " - " + get_today_date();
      } else if (filter_date_range === "yesterday") {
        document.querySelector(".filter_date").value =
          get_past_date(2) + " - " + get_past_date(2);
      } else if (filter_date_range === "last_7_days") {
        document.querySelector(".filter_date").value =
          get_past_date(7) + " - " + get_today_date();
      } else if (filter_date_range === "this_week") {
        document.querySelector(".filter_date").value =
          get_last_monday() + " - " + get_today_date();
      } else if (filter_date_range === "this_month") {
        document.querySelector(".filter_date").value =
          get_first_day_in_month() + " - " + get_today_date();
      } else if (filter_date_range === "custom") {
      }
    });
}

if (document.querySelector("#email") != undefined) {
  document.querySelector("#email").addEventListener("click", (event) => {
    document.querySelector("#email").classList.remove("is-invalid");
    document.querySelector("#email_error").innerHTML = "";
    document.querySelector("#email_error").style.display = "none";
  });
}

if (document.querySelectorAll(".ticket-ca-block") != undefined) {
  document.querySelectorAll(".ticket-ca-block").forEach((element) => {
    if (window.location.href.includes("tabs-activity")) {
      document.querySelectorAll(".ticket-comments-field").forEach((element) => {
        element.classList.add("hideblock");
      });

      document.querySelectorAll(".ticket-activity-field").forEach((element) => {
        element.classList.remove("hideblock");
      });
    }
    element.addEventListener("click", (event) => {
      var tab_type = event.target.parentNode.getAttribute("data-tab-type");
      if (tab_type == "activity") {
        document
          .querySelectorAll(".ticket-comments-field")
          .forEach((element) => {
            element.classList.add("hideblock");
          });

        document
          .querySelectorAll(".ticket-activity-field")
          .forEach((element) => {
            element.classList.remove("hideblock");
          });
      } else {
        document
          .querySelectorAll(".ticket-comments-field")
          .forEach((element) => {
            element.classList.remove("hideblock");
          });

        document
          .querySelectorAll(".ticket-activity-field")
          .forEach((element) => {
            element.classList.add("hideblock");
          });
      }
    });
  });
}

if (document.querySelector("#show-password") != undefined) {
  document
    .querySelector("#show-password")
    .addEventListener("click", (event) => {
      if (document.querySelector("#password").type == "password") {
        document.querySelector("#password").type = "text";
      } else {
        document.querySelector("#password").type = "password";
      }
    });
}

function get_last_monday() {
  let d = new Date();
  let dy = 1;
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : dy); // adjust when day is sunday
  return new Date(d.setDate(diff)).toLocaleDateString("fr-CH");
}

function get_first_day_in_month() {
  let date = new Date();
  return new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString(
    "fr-CH"
  );
}

const get_today_date = () => {
  return new Date().toLocaleDateString("fr-CH");
};
const get_past_date = (no_of_day) => {
  var date = new Date();
  date.setDate(date.getDate() - (no_of_day - 1));
  return new Date(date.toDateString()).toLocaleDateString("fr-CH");
};

function showErrorMessage(response) {
  document.querySelector("#" + response.field).classList.add("is-invalid");
  document.querySelector("#" + response.field + "_error").innerHTML =
    response.message;
  document.querySelector("#" + response.field + "_error").style.display =
    "block";
}

function sort_select_dropdown(id) {
  var dorpdown = $("#" + id);
  dorpdown.html(
    dorpdown.find("option").sort(function (option1, option2) {
      return $(option1).text() < $(option2).text() ? -1 : 1;
    })
  );
}

$(document).ready(function () {
  sort_select_dropdown("application");
  sort_select_dropdown("list_assignees");
  sort_select_dropdown("server");
  sort_select_dropdown("list_status");
  sort_select_dropdown("list_priority");
});
