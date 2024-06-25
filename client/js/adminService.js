if (window.location.href.includes("/admin")) {
    if(window.location.href.includes("/newBaby.html")){
        fetchLineUserList();
        $("#babyForm").on("submit", fetchPostNewBaby)
    }
}

function fetchLineUserList() {
    const config = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch("/admin/lineUserList", config)
      .then(res=>res.json())
      .then((data) => {
        if (data) {
          const { lineUserList } = data;
          // console.log("data:" + JSON.stringify(data));
          if (lineUserList) {
            lineUserList.forEach(function (user) {
              $("#lineUserSelect").append(
                `<option value="${user.id}">${user.name}</option>`
              );
            });

          } else {
            console.log("There is no lineUser in the record!");
          }
        }
      })
      .catch((err) => {
        console.error(err);
      });
}
function fetchPostNewBaby(e){
  e.preventDefault();

  const formData = new FormData(e.target);
  const name = formData.get("babyName");
  const gender = formData.get("babyGender");
  const birthday = formData.get("babyBirth");
  const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache" // without this config, the page return "304 Not Modified"
      },
      body: JSON.stringify({ name , gender, birthday }),
  };
  fetch("/admin/newBaby", config)
  .then(res => res.json())
  .then((data) => {
    console.log(data);
    if (data) {
      const { newBabyId } = data;
      
      if(newBabyId){
        $("#babyForm").append(
          `<h3>New Baby successfully! BabyId: ${newBabyId}</h3>`
        );
      }      
    }
  })
  .catch((err) => {
    alert(err);
    console.error(err);
  });
}
