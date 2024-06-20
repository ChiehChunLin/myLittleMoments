if (window.location.href.includes("/login")) {
  $("#lineBtn").on("click", function (e) {
    const LINE_CHANNEL_ID = "2005642025";
    const LINE_CALLBACK_URI =
      "https://2d66-59-120-11-125.ngrok-free.app/lineCallback";
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
    const provider = authProvider.NATIVE;
    const name = undefined;
    const email = formData.get("email");
    const password = formData.get("password");

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ provider, name, email, password })
    };
    loginFetch("/login", config);
  });
  $("#signupForm").submit(function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const provider = authProvider.NATIVE;
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(provider);
    //用function 包起來會出現，TypeError: NetworkError when attempting to fetch resource.
    // signinFetch("/user/signup", provider, email, password);
    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ provider, name, email, password })
    };
    loginFetch("/signup", config);
  });
}
function loginFetch(url, config) {
  fetch(url, config)
    .then(checkStatus)
    .then(checkResponse)
    .then((data) => {
      if (data) {
        const { access_token, access_expired, user, shoppingCount, message } =
          data;
        // console.log("data:" + JSON.stringify(user));

        if (access_token && user) {
          localStorage.setItem("accessToken", access_token);
          displayLoginUserInfo(user.name, user.email, user.picture);
          displayShoppingCount(shoppingCount);
          displayTempMessage("Login Successfully.");
        } else {
          if (message) {
            displayTempMessage(message);
          }
          console.error("Login failed:", data);
          throw new Error("Something went wrong with login authentication");
        }
      }
    })
    .catch((err) => {
      displayTempMessage(err);
      console.error("fetch error:", err);
    });
}
