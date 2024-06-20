if (window.location.href.includes("/timeline")) {
  $("#firstFollowForm").submit(function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
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
      window.location.href = "/timeline";
    }
  });

  if (!window.location.href.includes("/firstFollow")) {
    const friends = [
      {
        id: 1,
        name: "Baby 1",
        cover: "cover1.jpg",
        profilePic: "profile1.jpg",
        posts: [
          { time: "Posted on June 14, 2024", img: "post1-1.jpg" },
          { time: "Posted on June 13, 2024", img: "post1-2.jpg" }
        ]
      },
      {
        id: 2,
        name: "Baby 2",
        cover: "cover2.jpg",
        profilePic: "profile2.jpg",
        posts: [
          { time: "Posted on June 14, 2024", img: "post2-1.jpg" },
          { time: "Posted on June 13, 2024", img: "post2-2.jpg" }
        ]
      }
      // Add more friend data here
    ];

    document.querySelectorAll(".friend-item").forEach((item) => {
      item.addEventListener("click", function () {
        const friendId = parseInt(this.getAttribute("data-friend"));
        const friend = friends.find((f) => f.id === friendId);

        if (friend) {
          document.getElementById(
            "coverPhoto"
          ).style.backgroundImage = `url(${friend.cover})`;
          document.getElementById("profilePic").src = friend.profilePic;

          const postsContainer = document.getElementById("postsContainer");
          postsContainer.innerHTML = "";

          friend.posts.forEach((post) => {
            const postElement = document.createElement("div");
            postElement.className = "post card my-3";
            postElement.innerHTML = `
                            <div class="card-body">
                                <p class="post-time">${post.time}</p>
                                <img src="${post.img}" alt="Post Image" class="img-fluid">
                            </div>
                        `;
            postsContainer.appendChild(postElement);
          });
        }
      });
    });

    document
      .getElementById("addFriendBtn")
      .addEventListener("click", function () {
        const newFriendId = friends.length + 1;
        const newFriendName = `Friend ${newFriendId}`;
        friends.push({
          id: newFriendId,
          name: newFriendName,
          cover: "default-cover.jpg",
          profilePic: "default-profile.jpg",
          posts: []
        });

        const newFriendItem = document.createElement("li");
        newFriendItem.className = "list-group-item friend-item";
        newFriendItem.setAttribute("data-friend", newFriendId);
        newFriendItem.textContent = newFriendName;
        newFriendItem.addEventListener("click", function () {
          const friendId = parseInt(this.getAttribute("data-friend"));
          const friend = friends.find((f) => f.id === friendId);

          if (friend) {
            document.getElementById(
              "coverPhoto"
            ).style.backgroundImage = `url(${friend.cover})`;
            document.getElementById("profilePic").src = friend.profilePic;

            const postsContainer = document.getElementById("postsContainer");
            postsContainer.innerHTML = "";

            friend.posts.forEach((post) => {
              const postElement = document.createElement("div");
              postElement.className = "post card my-3";
              postElement.innerHTML = `
                            <div class="card-body">
                                <p class="post-time">${post.time}</p>
                                <img src="${post.img}" alt="Post Image" class="img-fluid">
                            </div>
                        `;
              postsContainer.appendChild(postElement);
            });
          }
        });

        document
          .getElementById("friendList")
          .insertBefore(newFriendItem, this.parentElement);
      });

    document
      .getElementById("coverInput")
      .addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById(
              "coverPhoto"
            ).style.backgroundImage = `url(${e.target.result})`;
          };
          reader.readAsDataURL(file);
        }
      });

    document
      .getElementById("profileInput")
      .addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            document.getElementById("profilePic").src = e.target.result;
          };
          reader.readAsDataURL(file);
        }
      });

    document
      .getElementById("profilePic")
      .addEventListener("click", function () {
        document.getElementById("profileInput").click();
      });

    document.querySelectorAll(".tree-item").forEach((item) => {
      item.addEventListener("click", function () {
        this.classList.toggle("active");
      });
    });
  }
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
      displayLoginMessage(message);
    })
    .catch((err) => {
      displayLoginMessage(err.message);
      console.error(err);
    });
}
function fetchDailyData(babyId) {
  const config = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ provider, name, email, password })
  };
  loginFetch("/signup", config);
}
