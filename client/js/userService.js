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
}
