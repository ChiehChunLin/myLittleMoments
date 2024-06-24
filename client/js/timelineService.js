if (window.location.href.includes("/timeline")) {
  $("#firstFollowForm").on("submit", function (e) {
    e.preventDefault();
    console.log("click")
    const followForm = document.getElementById("firstFollowForm");
    const formData = new FormData(followForm);
    const babyRole = formData.get("babyRole");
    const relation = formData.get("call");
    const babyId = formData.get("babyId");

    const checkAuth = userCheckAuth();
    if (checkAuth) {
      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache" // without this config, the page return "304 Not Modified"
        },
        body: JSON.stringify({ babyId, babyRole, relation })
      };
      userFolowFetch("/timeline/firstFollow", config);

      $(".babyFollow").removeClass("divShow").addClass("divHide");
      // window.location.href = "/timeline";
    }
  });

  $("#addBabyBtn").on("click", function (e){
    $(".babyFollow").removeClass("divHide").addClass("divShow");
  })
  $("#cancelBtn").on("click", function (e){
    $(".babyFollow").removeClass("divShow").addClass("divHide");
  })

  $("#changeCoverBtn").on("click", function (e) {
    document.getElementById("coverInput").click();
  })
  $("#profilePic").on("click", function (e) {
    document.getElementById("profileInput").click();
  })

  $("#profileInput").on("change", function(e) {
    e.preventDefault();

    const file = this.files[0];
    const babyId = document.getElementById("profilePic").getAttribute("value");
    if (file) {
      const formData = new FormData();     
      formData.append("babyId", babyId);
      formData.append("file", file);
      formData.append("type", "profile");

      console.log(formData);
      const url = "/timeline/uploadImage";
      const config = {
        method: "POST",
        body: formData,
      };
      userUploadFetch(url, config);
      // $("#profileInput img").attr("src", e.target.result);
    }
  })    
  $("#coverInput").on("change", function(e) {
    e.preventDefault();

    const file = this.files[0];
    const babyId = document.getElementById("profilePic").getAttribute("value");
    if (file) {
      const url = "/timeline/uploadImage";
      const config = {
        method: "POST",
        body: JSON.stringify({ babyId, file, type: "cover" }),
      };
      userUploadFetch(url, config);

      // document.getElementById(
      //   "coverPhoto"
      // ).style.backgroundImage = `url(${e.target.result})`;
    }      
  })
  
  document.querySelectorAll('.baby-item').forEach(item => {    
    item.addEventListener('click', function() {
      
      document.querySelectorAll('.babyChecked').forEach(img => {
        $(img.closest(".baby-item")).removeClass('baby-selected');
        img.style.display = 'none';
      });

      $(this).addClass('baby-selected');
      const checkedImg = this.querySelector('.babyChecked');
      if (checkedImg) {
        checkedImg.style.display = 'block';

        const babyId = checkedImg.parentElement.getAttribute("data-baby");
        //fetch baby data and display
        //div.post-content
      }
    });
  });

  document.querySelectorAll(".tree-item").forEach((item) => {
    item.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });

  document.querySelectorAll(".viewAll").forEach((view) => {
    view.addEventListener("click", function (e) {
      const date = e.target.parentElement.previousElementSibling.children[0].getAttribute("value");
      const babyId = document.getElementById("profilePic").getAttribute("value");
      fetchImagesToCarousel(date, babyId);
    });
  });

 
}

function userCheckAuth() {
  if (localStorage.getItem("accessToken") === null) {
    const accessJwtToken = document.cookie.split("accessToken=")[1];
    localStorage.setItem("accessToken", accessJwtToken);
  }
  return true;
}
function userFolowFetch(url, config = "") {
  fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      const { message } = data;
      confirm(message);
    })
    .catch((err) => {
      alert(err.message);
      console.error(err);
    });
}
function userUploadFetch(url,config ="") {
  fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      const { message } = data;
      confirm(message);
    })
    .catch((err) => {
      alert(err.message);
      console.error(err);
    });
}

function fetchImagesToCarousel(date, babyId){
  const url = "/timeline/image/daily"
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ date, babyId })
  };
  fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const { images } = data;
      displayImagesInCarousel(images);
      $(".close-carousel").on("click", function(e) {
        document.getElementById("fullscreenCarousel").remove();
      })
    })
    .catch((err) => {
      console.error(err);
    });
}
function displayImagesInCarousel(images){
  let insertHTML =
  `
    <div id="fullscreenCarousel" class="fullscreen-carousel">
        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
          <div class="close-carousel">&times;</div>
          <div class="carousel-inner">          
  `;
  
  for(let i = 0 ; i< images.length; i++){
    const active = (i==0) ? "active" : "";
    if(images[i].type === "image")
    {
      insertHTML += 
      `
        <div class="carousel-item ${active}">
          <img src=${images[i].filename} class="d-block w-100" alt="...">
        </div>
      `;
    } else {
      insertHTML += 
      `
        <div class="carousel-item ${active}">
          <video src=${images[i].filename} type="video/mp4" class="d-block w-100" alt="..." controls></video>
        </div>
      `;
    }    
  }
  insertHTML += 
  `
        </div>
        <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="sr-only">Next</span>
        </a>
      </div>
    </div>
  `
  const body = document.getElementsByTagName("body");
  body[0].insertAdjacentHTML('afterbegin', insertHTML);
}
