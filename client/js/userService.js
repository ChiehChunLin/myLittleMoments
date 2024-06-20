if (window.location.href.includes("/login")) {
  $("#lineBtn").on("click", function (e) {
    const LINE_CHANNEL_ID = "2005642025";
    // const LINE_CALLBACK_URI = "https://www.chiehchunlin.com/lineCallback";
    const LINE_CALLBACK_URI =
      "https://a949-59-120-11-125.ngrok-free.app/lineCallback";
    const LINE_STATE = crypto.randomUUID().replace(/[-]+/g, ""); //prevent xss
    const LINE_NONCE = crypto.randomUUID().replace(/[-]+/g, ""); //prevent xss
    let link = "https://access.line.me/oauth2/v2.1/authorize?";
    link += "response_type=code";
    link += "&client_id=" + LINE_CHANNEL_ID;
    link += "&redirect_uri=" + LINE_CALLBACK_URI;
    link += "&state=" + LINE_STATE;
    link += "&scope=profile%20openid&nonce=" + LINE_NONCE;
    window.location.href = link;
  });

  $(".login-a").on("click", function (e) {
    $(".login-div").removeClass("formHide").addClass("formShow");
    $(".signup-div").removeClass("formShow").addClass("formHide");
  });

  $(".signin-a").on("click", function (e) {
    $(".login-div").removeClass("formShow").addClass("formHide");
    $(".signup-div").removeClass("formHide").addClass("formShow");
  });

  $("#loginForm").submit(function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = undefined;
    const email = formData.get("email");
    const password = formData.get("password");

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    };
    userCheckinFetch("/login", config);
  });

  $("#signupForm").submit(function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, email, password })
    };
    userCheckinFetch("/signup", config);
  });
}

function userCheckAuth() {
  if (localStorage.getItem("accessToken") === null) {
    const url = "/authCheck";
    userCheckinFetch(url);
  }
  return true;
}
function userCheckinFetch(url, config = "") {
  fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        const { accessJwtToken, accessExpired, user, message } = data;
        // console.log("data: %j", data);

        if (accessJwtToken && user) {
          localStorage.setItem("accessToken", accessJwtToken);
          displayLoginMessage("Login Successfully!");
          if (url != "/authCheck") {
            window.location.href = "/admin/timeline";
          }
        } else {
          console.error("Login data failed:", data);
          throw new Error("Something went wrong with login authentication");
        }
      }
    })
    .catch((err) => {
      displayLoginMessage(err.message);
      console.error(err);
    });
}
function displayLoginMessage(message) {
  if (message) {
    const messageDiv = document.querySelector(".message");
    messageDiv.textContent = message;

    setTimeout(() => {
      messageDiv.textContent = "";
    }, 5000); // Hide after 5 seconds
  }
}
