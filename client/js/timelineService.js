if (window.location.href.includes("/timeline")) {

  //=====================================================
  //============  Add Baby Follow Form  =================
  //=====================================================
  $("#newBabyForm").on("submit", function (e) {
    e.preventDefault();

    const newBabyForm = document.getElementById("newBabyForm");
    const formData = new FormData(newBabyForm);

    const checkAuth = userCheckAuth();
    if (checkAuth) {
      const config = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData
      };
      userNewBabyAndFolowFetch("/timeline/newBaby", config);
    }
  });
  $("#inputBabyFront").on("change", function (e) {
    const fileName = e.target.value.split('\\').pop() || e.target.files[0].name;
    const label = document.querySelector(`label[for="${e.target.id}"]`);
    label.textContent = fileName;
  })
  $("#inputBabySide").on("change", function (e) {
    const fileName = e.target.value.split('\\').pop() || e.target.files[0].name;
    const label = document.querySelector(`label[for="${e.target.id}"]`);
    label.textContent = fileName;
  })
  $("#inputBabyUpward").on("change", function (e) {
    const fileName = e.target.value.split('\\').pop() || e.target.files[0].name;
    const label = document.querySelector(`label[for="${e.target.id}"]`);
    label.textContent = fileName;
  })
  $("#firstFollowForm").on("submit", function (e) {
    e.preventDefault();

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
      userNewBabyAndFolowFetch("/timeline/firstFollow", config);
    }
  });
  $("#inputRole").on("change", function(e){
    if(e.target.value === "manager"){
      $(".showNewBabyLink")[0].style.display = "block";
    }else{
      $(".showNewBabyLink")[0].style.display = "none";
    }
  })

  $("#addBabyBtn").on("click", function (e){
    $(".babyFollow").removeClass("divHide").addClass("divShow");
  })
  $("#cancelBtn").on("click", function (e){
    $(".babyFollow").removeClass("divShow").addClass("divHide");
  })

  $(".addMyBot").on("click", function (e){
    $(".myBotDiv").removeClass("divHide").addClass("divShow");
  })
  $("#cancelMyBot").on("click", function (e){
    $(".myBotDiv").removeClass("divShow").addClass("divHide");
  })

  $(".newBaby-a").on("click", function (e) {
    $(".newBabyForm-div").removeClass("divHide").addClass("divShow");
    $(".firstFollow-div").removeClass("divShow").addClass("divHide");
  })
  $(".followBaby-a").on("click", function (e) {
    $(".firstFollow-div").removeClass("divHide").addClass("divShow");
    $(".newBabyForm-div").removeClass("divShow").addClass("divHide");
  })

  //=====================================================
  //============  Timeline Tab Changes  =================
  //=====================================================
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
        const date = new Date().toISOString().slice(0, 10);
        fetchSelectedBabyPage(date, babyId);
      }
    });
  });

  document.querySelectorAll(".tree-item").forEach((item) => {
    item.addEventListener("click", function () {
      this.classList.toggle("active");
    });
  });

  $(".imageBlock").on("click", function (e) {
    $("#postsContainer").removeClass("divHide").addClass("divShow");
    $("#diaryContainer").removeClass("divShow").addClass("divHide");
    $("#tagContainer").removeClass("divShow").addClass("divHide");
    $("#healthContainer").removeClass("divShow").addClass("divHide");
  });
  $(".diaryBlock").on("click", function (e) {
    $("#postsContainer").removeClass("divShow").addClass("divHide");
    $("#diaryContainer").removeClass("divHide").addClass("divShow");
    $("#tagContainer").removeClass("divShow").addClass("divHide");
    $("#healthContainer").removeClass("divShow").addClass("divHide");
  });
  $(".tagsBlock").on("click", function (e) {
    $("#postsContainer").removeClass("divShow").addClass("divHide");
    $("#diaryContainer").removeClass("divShow").addClass("divHide");
    $("#tagContainer").removeClass("divHide").addClass("divShow");
    $("#healthContainer").removeClass("divShow").addClass("divHide");
  });
  $(".healthBlock").on("click", function (e) {
    if(document.querySelector("#healthContainer").getAttribute("loaded") == "false"){
      const babyId = document.querySelector("#profilePic").getAttribute("value");
      const date = new Date().toISOString().slice(0, 10);  //YYYY-MM-DD
      fetchChartData(date, babyId)
    }
    $("#postsContainer").removeClass("divShow").addClass("divHide");
    $("#diaryContainer").removeClass("divShow").addClass("divHide");
    $("#tagContainer").removeClass("divShow").addClass("divHide");
    $("#healthContainer").removeClass("divHide").addClass("divShow");
    $(".age-tree").hide();
  });

  //=====================================================
  //============  Baby Profile Display  =================
  //=====================================================
  $("#changeCoverBtn").on("click", function (e) {
    document.getElementById("coverInput").click();
  })
  $("#profilePic").on("click", function (e) {
    if(e.target.getAttribute("title") != ""){
      document.getElementById("profileInput").click();
    }    
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

      // console.log(formData);
      const url = "/timeline/uploadImage";
      const config = {
        method: "POST",
        body: formData,
      };
      userUploadFetch(url, config);
    }
  })    
  $("#coverInput").on("change", function(e) {
    e.preventDefault();

    const file = this.files[0];
    const babyId = document.getElementById("profilePic").getAttribute("value");
    if (file) {
      const formData = new FormData();     
      formData.append("babyId", babyId);
      formData.append("file", file);
      formData.append("type", "cover");

      // console.log(formData);
      const url = "/timeline/uploadImage";
      const config = {
        method: "POST",
        body: formData,
      };
      userUploadFetch(url, config);
    }      
  })
  
  //=====================================================
  //============  Baby Timeline Action  =================
  //=====================================================
  document.querySelectorAll(".viewAll").forEach((view) => {
    view.addEventListener("click", function (e) {
      const date = e.target.parentElement.previousElementSibling.children[0].getAttribute("value");
      const babyId = document.getElementById("profilePic").getAttribute("value");
      fetchImagesToCarousel(date, babyId);
    });
  });
}

const chartWidth = $(window).width() * 0.5;
const chartHeight = chartWidth * 0.75;

function userCheckAuth() {
  if (localStorage.getItem("accessToken") === null) {
    const accessJwtToken = document.cookie.split("accessToken=")[1];
    localStorage.setItem("accessToken", accessJwtToken);
  }
  return true;
}
function userNewBabyAndFolowFetch(url, config = "") {
  fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      const { message } = data;      
      if(message){
        confirm(message);
        $(".babyFollow").removeClass("divShow").addClass("divHide");
        window.location.href = "/timeline";
      }      
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
      window.location.reload();
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
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
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

function fetchSelectedBabyPage(date, babyId){
  const url ="/timeline/babyProfile";
  const config ={
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache"
    },
    body: JSON.stringify({ babyId, date })
  }
  fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      const { babyData, imageData, textData, healthData } = data;
      displayBabyProfilePage(babyData, imageData, textData, healthData);
      document.querySelector(".imageBlock").click();      
    })
    .catch((err) => {
      console.error(err);
    });
}
function fetchChartData(date, babyId) {
  const url = "/timeline/health";
  const config = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
      "Cache-Control": "no-cache" // without this config, the page return "304 Not Modified"
    },
    body: JSON.stringify({ babyId, date })
  };
  fetch(url, config)
    .then((res) => res.json())
    .then((data) => {
      if (data) {
        const { dailyData, weightData, heightData } = data;
        // console.log("%j", data);
        if (dailyData) {
          showBabyDailyChart(dailyData);
          summeryWeekTable(dailyData);
        }
        if (weightData) {
          const cdcWeight = getCdcData(weightData.gender, babyActivity.WEIGHT);
          showBabyWeightLength(
            babyActivity.WEIGHT,
            cdcWeight,
            weightData.weights
          );
          recordTable(babyActivity.WEIGHT, weightData.weights);
        }
        if (heightData) {
          const cdcHeight = getCdcData(heightData.gender, babyActivity.HEIGHT);
          showBabyWeightLength(
            babyActivity.HEIGHT,
            cdcHeight,
            heightData.heights
          );
          recordTable(babyActivity.HEIGHT, heightData.heights);
        }
        document.querySelector("#healthContainer").setAttribute("loaded", "true")
      }
    })
    .catch((err) => {
      console.error("fetch error:", err);
    });
}
function displayBabyProfilePage(babyData, imageData, textData, healthData){
  console.log(babyData.userRole)
  if(babyData.userRole != 'manager'){
    document.querySelector("#changeCoverBtn").style.display = "none"; 
    document.querySelector("#profilePic img").setAttribute("title", "");
    document.querySelector(".profile-info").children[0].textContent = babyData.name;
  } else {
    document.querySelector("#changeCoverBtn").style.display = "inline-block"; 
    document.querySelector("#profilePic img").setAttribute("title", "點擊更換大頭貼");
    const profileTitle = `
      ${babyData.name}
      <span style="margin:0rem 1rem; color:grey; font-size:small;">${babyData.id}</span>
    `; 
    document.querySelector(".profile-info").children[0].innerHTML = '';
    document.querySelector(".profile-info").children[0].insertAdjacentHTML('afterbegin', profileTitle);
  }   
  document.querySelector("#profilePic").setAttribute("value", babyData.id);
  document.querySelector("#coverPhoto").children[0].setAttribute("src", babyData.cover);
  document.querySelector("#profilePic").children[0].setAttribute("src", babyData.headshot);
  document.querySelector(".profile-info").children[1].textContent = `${babyData.old} | ${babyData.followed} family members`;
  
  displayTimelineImages(imageData);
  displayTimelineTexts(textData);
  displayHealthCharts(healthData);
}
function displayTimelineImages(imageData){
  
  const postDiv = document.getElementById("postsContainer");
  postDiv.innerHTML = "";

  if(imageData.length === 0){
    const message = document.createElement("h3");
    message.textContent = "快快來分享小小時光吧！";
    postDiv.appendChild(message);
    return;
  }
  
  let innerHTML ="";
  for(let i = imageData.length - 1; i >= 0; i--){
    const count = (imageData[i].images.length < 5) ? imageData[i].images.length : 5;
    innerHTML += 
    `
     <div class="post card my-3">
       <div class="card-body">
         <p class="post-time" value="${imageData[i].date}">Posted on ${imageData[i].date }</p>
         <div class="imageBlocks" data-blocks="${count}" > 
    `;
    for(let j=0; j< count; j++){
        innerHTML +=
        `
          <div class="block">
        `;
        if (imageData[i].images[j].type === "image") {
            innerHTML +=
            `
              <img
                src=${imageData[i].images[j].filename}
                alt="Post Image ${j}"
                class="img-fluid"
              />
            `
        }
        if (imageData[i].images[j].type === "video") {
          innerHTML +=
          `
              <video
                src=${imageData[i].images[j].filename}
                autoplay="autoplay"
                loop="loop"
                muted="muted"
                alt="Post Video ${j}"
                class="img-fluid"
              ></video>
          `
        }
        innerHTML +=
        `
          </div>
        `;
    }
    if(imageData[i].images.length > 5) {
      innerHTML +=
      `
        <div class="block blockFilter">+${imageData[i].images.length - 5}</div>
      `
    }
    innerHTML+=
    `
          </div>    
       </div>
       <div class="card-footer" style="text-align: right">
         <span>Photo ${imageData[i].images.length}</span>
         <span>·</span>
         <span class="viewAll">View all ></span>
       </div>
     </div>
    `
  }

  postDiv.insertAdjacentHTML('afterbegin', innerHTML);

}
function displayTimelineTexts(textData){

  const diaryDiv = document.getElementById("diaryContainer");
  diaryDiv.innerHTML = "";

  if(textData.length === 0){
    const message = document.createElement("h3");
    message.textContent = "快快來分享小小時光吧！";
    diaryDiv.appendChild(message);
    return;
  }

  let innerHTML ="";
  for(let i=0 ; i < textData.length; i++){
    innerHTML+=
    `
      <div class="post card my-3">
        <div class="card-body">
          <p class="post-time">Posted on ${textData[i].date}</p>
          <p class="txt-fluid">${textData[i].content}</p>
        </div>
      </div>
    `;    
  }
  diaryDiv.insertAdjacentHTML('afterbegin', innerHTML);
}
function displayHealthCharts(healthData){
  document.getElementById("babyActivityChart").innerHTML="";
  document.getElementById("weeklySummary").innerHTML="";

  document.getElementById("babyGrowthWeight").innerHTML="";
  document.getElementById("weightRecords").innerHTML="";

  document.getElementById("babyGrowthLength").innerHTML="";
  document.getElementById("heightRecords").innerHTML="";

  const { dailyData, weightData, heightData } = healthData;

  if (dailyData) {
    showBabyDailyChart(dailyData);
    summeryWeekTable(dailyData);
  }
  if (weightData) {
    const cdcWeight = getCdcData(weightData.gender, babyActivity.WEIGHT);
    showBabyWeightLength(
      babyActivity.WEIGHT,
      cdcWeight,
      weightData.weights
    );
    recordTable(babyActivity.WEIGHT, weightData.weights);
  }
  if (heightData) {
    const cdcHeight = getCdcData(heightData.gender, babyActivity.HEIGHT);
    showBabyWeightLength(
      babyActivity.HEIGHT,
      cdcHeight,
      heightData.heights
    );
    recordTable(babyActivity.HEIGHT, heightData.heights);
  }
}
function getCdcData(gender, type) {
  if (type == babyActivity.WEIGHT) {
    if (gender == babyGender.GIRL) {
      return femaleWeight;
    } else {
      return maleWeight;
    }
  } else {
    if (gender == babyGender.GIRL) {
      return femaleLength;
    } else {
      return maleLength;
    }
  }
}
function showBabyDailyChart(dailyData) {
  const activityColors = {
    milk: "#FF6384",
    food: "#36A2EB",
    sleep: "#C0C0C0",
    medicine: "#4BC0C0",
    play: "#FFCE56"
  };

  const labels = dailyData.map((day) => day.date);

  const margin = { top: 20, right: 100, bottom: 40, left: 50 };
  const width = chartWidth - margin.left - margin.right;
  const height = chartHeight - margin.top - margin.bottom;

  const x = d3.scaleBand().domain(labels).range([0, width]).padding(0.1);
  const y = d3.scaleLinear().domain([0, 24]).range([height, 0]);

  const svg = d3
    .select("#babyActivityChart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  dailyData.forEach((day) => {
    const dailyActivities = day.daily;

    dailyActivities.forEach((activity) => {
      const startTime = new Date(activity.starttime);
      const endTime = new Date(activity.endtime);
      const activityDuration = (endTime - startTime) / 3600000; // 小時
      const activityStartHour =
        startTime.getHours() + startTime.getMinutes() / 60;

      svg
        .append("rect")
        .attr("x", x(day.date))
        .attr("y", y(activityStartHour + activityDuration))
        .attr("width", x.bandwidth())
        .attr(
          "height",
          y(activityStartHour) - y(activityStartHour + activityDuration)
        )
        .attr("fill", activityColors[activity.activity])
        .attr("class", "activity-rect");
    });
  });

  svg
    .append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  svg.append("g").call(
    d3
      .axisLeft(y)
      .ticks(24)
      .tickFormat((d) => `${d}:00`)
  );

  const legend = svg
    .append("g")
    .attr("transform", `translate(${width + 20},0)`);

  Object.keys(activityColors).forEach((activity, i) => {
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", i * 20)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", activityColors[activity]);

    legend
      .append("text")
      .attr("x", 20)
      .attr("y", i * 20 + 9)
      .text(activity);
  });
}
function showBabyWeightLength(title, cdcData, babyData) {
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const width = chartWidth - margin.left - margin.right;
  const height = chartHeight - margin.top - margin.bottom;

  let selectedDiv = "#babyGrowthWeight";
  if (title == babyActivity.HEIGHT) selectedDiv = "#babyGrowthLength";
  const yStart = (title == babyActivity.WEIGHT) ? 0 : 40;

  const svg = d3
    .select(selectedDiv)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleLinear()
    .domain(d3.extent(cdcData, (d) => d.age))
    .range([0, width]);

  const y = d3
    .scaleLinear()
    .domain([yStart, d3.max(cdcData, (d) => d["97th"])])
    .range([height, 0]);

  const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
  const yAxis = d3.axisLeft(y);

  svg.append("g").attr("transform", `translate(0,${height})`).call(xAxis);

  svg.append("g").call(yAxis);

  const color = d3
    .scaleOrdinal()
    .domain([
      "97th",
      "95th",
      "90th",
      "75th",
      "50th",
      "25th",
      "10th",
      "5th",
      "3rd"
    ])
    .range(d3.schemeCategory10);

  const line = d3
    .line()
    .x((d) => x(d.age))
    .y((d) => y(d.value));

  const percentiles = [
    "97th",
    "95th",
    "90th",
    "75th",
    "50th",
    "25th",
    "10th",
    "5th",
    "3rd"
  ];

  percentiles.forEach((percentile) => {
    svg
      .append("path")
      .datum(cdcData.map((d) => ({ age: d.age, value: d[percentile] })))
      .attr("fill", "none")
      .attr("stroke", color(percentile))
      .attr("stroke-width", 1.5)
      .attr("d", line)
      .attr("class", percentile);
  });

  const legend = svg
    .selectAll(".legend")
    .data(percentiles)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

  legend
    .append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", (d) => color(d));

  legend
    .append("text")
    .attr("x", width - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text((d) => d);

  svg
    .selectAll(".dot")
    .data(babyData)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.age))
    .attr("cy", (d) => y(d[title]))
    .attr("r", 3)
    .style("fill", "red");
}
function summeryWeekTable(weeklyData) {
  const weeklySummaryDiv = document.getElementById("weeklySummary");
  const table = document.createElement("table");

  // Create header row
  const thead = document.createElement("thead");
  const headersRow = document.createElement("tr");

  // Empty cell for corner
  const cornerCell = document.createElement("th");
  cornerCell.textContent = "";
  headersRow.appendChild(cornerCell);

  // Add dates as headers
  weeklyData.forEach((day) => {
    const th = document.createElement("th");
    th.textContent = day.date;
    headersRow.appendChild(th);
  });
  thead.appendChild(headersRow);
  table.appendChild(thead);

  // Create body
  const tbody = document.createElement("tbody");

  // Create rows for each activity type
  ["dailyMilk", "dailyFood", "dailySleep", "dailyMedicine"].forEach(
    (activity) => {
      const row = document.createElement("tr");

      // Activity name cell
      const activityCell = document.createElement("td");
      activityCell.textContent = activity.replace("daily", ""); // Remove 'daily' prefix
      row.appendChild(activityCell);

      // Data cells for each day
      weeklyData.forEach((day) => {
        const td = document.createElement("td");
        td.textContent = day[activity];
        row.appendChild(td);
      });

      tbody.appendChild(row);
    }
  );
  table.appendChild(tbody);
  weeklySummaryDiv.appendChild(table);
}
function recordTable(title, data) {
  const recordDiv = document.getElementById(title + "Records");
  const table = document.createElement("table");

  // Create header row
  const thead = document.createElement("thead");
  const headersRow = document.createElement("tr");

  // Empty cell for corner
  const cornerCell = document.createElement("th");
  cornerCell.textContent = "";
  headersRow.appendChild(cornerCell);

  // Create body
  const tbody = document.createElement("tbody");

  // Create rows for each activity type
  ["age", title].forEach((activity) => {
    const row = document.createElement("tr");

    // Activity name cell
    const activityCell = document.createElement("th");
    activityCell.textContent = activity;
    row.appendChild(activityCell);

    // Data cells for each day
    data.forEach((day) => {
      const td = document.createElement("td");
      td.textContent = day[activity];
      row.appendChild(td);
    });

    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  recordDiv.appendChild(table);
}

//================================================================================
//Ref:https://www.cdc.gov/growthcharts/html_charts/lenageinf.htm#females
// Males, Ages Birth – 36 Months
const maleLength = [
  {
    age: 0,
    "3rd": 44.9251,
    "5th": 45.56841,
    "10th": 46.55429,
    "25th": 48.18937,
    "50th": 49.98888,
    "75th": 51.77126,
    "90th": 53.36153,
    "95th": 54.30721,
    "97th": 54.919
  },
  {
    age: 0.5,
    "3rd": 47.97812,
    "5th": 48.55809,
    "10th": 49.4578,
    "25th": 50.97919,
    "50th": 52.69598,
    "75th": 54.44054,
    "90th": 56.03444,
    "95th": 56.99908,
    "97th": 57.62984
  },
  {
    age: 1.5,
    "3rd": 52.19859,
    "5th": 52.72611,
    "10th": 53.55365,
    "25th": 54.9791,
    "50th": 56.62843,
    "75th": 58.35059,
    "90th": 59.9664,
    "95th": 60.96465,
    "97th": 61.62591
  },
  {
    age: 2.5,
    "3rd": 55.26322,
    "5th": 55.77345,
    "10th": 56.57772,
    "25th": 57.9744,
    "50th": 59.60895,
    "75th": 61.33788,
    "90th": 62.98158,
    "95th": 64.00789,
    "97th": 64.69241
  },
  {
    age: 3.5,
    "3rd": 57.73049,
    "5th": 58.23744,
    "10th": 59.0383,
    "25th": 60.43433,
    "50th": 62.077,
    "75th": 63.82543,
    "90th": 65.49858,
    "95th": 66.54889,
    "97th": 67.2519
  },
  {
    age: 4.5,
    "3rd": 59.82569,
    "5th": 60.33647,
    "10th": 61.1441,
    "25th": 62.55409,
    "50th": 64.21686,
    "75th": 65.99131,
    "90th": 67.69405,
    "95th": 68.76538,
    "97th": 69.48354
  },
  {
    age: 5.5,
    "3rd": 61.66384,
    "5th": 62.18261,
    "10th": 63.00296,
    "25th": 64.43546,
    "50th": 66.12531,
    "75th": 67.92935,
    "90th": 69.66122,
    "95th": 70.75128,
    "97th": 71.48218
  },
  {
    age: 6.5,
    "3rd": 63.31224,
    "5th": 63.84166,
    "10th": 64.67854,
    "25th": 66.13896,
    "50th": 67.86018,
    "75th": 69.69579,
    "90th": 71.45609,
    "95th": 72.56307,
    "97th": 73.30488
  },
  {
    age: 7.5,
    "3rd": 64.81395,
    "5th": 65.35584,
    "10th": 66.21181,
    "25th": 67.70375,
    "50th": 69.45908,
    "75th": 71.32735,
    "90th": 73.11525,
    "95th": 74.23767,
    "97th": 74.98899
  },
  {
    age: 8.5,
    "3rd": 66.19833,
    "5th": 66.75398,
    "10th": 67.63088,
    "25th": 69.15682,
    "50th": 70.94804,
    "75th": 72.84947,
    "90th": 74.6641,
    "95th": 75.80074,
    "97th": 76.56047
  },
  {
    age: 9.5,
    "3rd": 67.48635,
    "5th": 68.05675,
    "10th": 68.95591,
    "25th": 70.51761,
    "50th": 72.34586,
    "75th": 74.2806,
    "90th": 76.1211,
    "95th": 77.27095,
    "97th": 78.03819
  },
  {
    age: 10.5,
    "3rd": 68.6936,
    "5th": 69.27949,
    "10th": 70.20192,
    "25th": 71.80065,
    "50th": 73.66665,
    "75th": 75.63462,
    "90th": 77.50016,
    "95th": 78.66234,
    "97th": 79.43637
  },
  {
    age: 11.5,
    "3rd": 69.832,
    "5th": 70.43397,
    "10th": 71.38046,
    "25th": 73.01712,
    "50th": 74.9213,
    "75th": 76.92224,
    "90th": 78.81202,
    "95th": 79.98578,
    "97th": 80.76602
  },
  {
    age: 12.5,
    "3rd": 70.91088,
    "5th": 71.52941,
    "10th": 72.50055,
    "25th": 74.17581,
    "50th": 76.11838,
    "75th": 78.15196,
    "90th": 80.0652,
    "95th": 81.2499,
    "97th": 82.03585
  },
  {
    age: 13.5,
    "3rd": 71.9377,
    "5th": 72.57318,
    "10th": 73.56946,
    "25th": 75.2838,
    "50th": 77.2648,
    "75th": 79.33061,
    "90th": 81.2666,
    "95th": 82.46167,
    "97th": 83.25292
  },
  {
    age: 14.5,
    "3rd": 72.91853,
    "5th": 73.5713,
    "10th": 74.59309,
    "25th": 76.34685,
    "50th": 78.36622,
    "75th": 80.4638,
    "90th": 82.42185,
    "95th": 83.6268,
    "97th": 84.42302
  },
  {
    age: 15.5,
    "3rd": 73.85839,
    "5th": 74.52871,
    "10th": 75.57634,
    "25th": 77.36973,
    "50th": 79.42734,
    "75th": 81.5562,
    "90th": 83.53568,
    "95th": 84.75006,
    "97th": 85.55095
  },
  {
    age: 16.5,
    "3rd": 74.76147,
    "5th": 75.44958,
    "10th": 76.5233,
    "25th": 78.35646,
    "50th": 80.45209,
    "75th": 82.61174,
    "90th": 84.61204,
    "95th": 85.83547,
    "97th": 86.64078
  },
  {
    age: 17.5,
    "3rd": 75.63132,
    "5th": 76.33742,
    "10th": 77.43742,
    "25th": 79.31042,
    "50th": 81.44384,
    "75th": 83.63377,
    "90th": 85.65431,
    "95th": 86.88645,
    "97th": 87.69597
  },
  {
    age: 18.5,
    "3rd": 76.47096,
    "5th": 77.19523,
    "10th": 78.32168,
    "25th": 80.23453,
    "50th": 82.40544,
    "75th": 84.62515,
    "90th": 86.66541,
    "95th": 87.90595,
    "97th": 88.7195
  },
  {
    age: 19.5,
    "3rd": 77.283,
    "5th": 78.0256,
    "10th": 79.17863,
    "25th": 81.13131,
    "50th": 83.33938,
    "75th": 85.58837,
    "90th": 87.64786,
    "95th": 88.89652,
    "97th": 89.71393
  },
  {
    age: 20.5,
    "3rd": 78.06971,
    "5th": 78.83077,
    "10th": 80.01048,
    "25th": 82.00292,
    "50th": 84.24783,
    "75th": 86.52562,
    "90th": 88.60385,
    "95th": 89.86038,
    "97th": 90.68153
  },
  {
    age: 21.5,
    "3rd": 78.83308,
    "5th": 79.61271,
    "10th": 80.81919,
    "25th": 82.85129,
    "50th": 85.1327,
    "75th": 87.43879,
    "90th": 89.53533,
    "95th": 90.79951,
    "97th": 91.62428
  },
  {
    age: 22.5,
    "3rd": 79.57485,
    "5th": 80.37315,
    "10th": 81.60646,
    "25th": 83.67811,
    "50th": 85.99565,
    "75th": 88.32957,
    "90th": 90.44402,
    "95th": 91.71563,
    "97th": 92.54392
  },
  {
    age: 23.5,
    "3rd": 80.29656,
    "5th": 81.11363,
    "10th": 82.37381,
    "25th": 84.48487,
    "50th": 86.83818,
    "75th": 89.19948,
    "90th": 91.33143,
    "95th": 92.61031,
    "97th": 93.44203
  },
  {
    age: 24.5,
    "3rd": 80.99959,
    "5th": 81.83552,
    "10th": 83.12259,
    "25th": 85.2729,
    "50th": 87.66161,
    "75th": 90.04985,
    "90th": 92.19893,
    "95th": 93.48491,
    "97th": 94.31998
  },
  {
    age: 25.5,
    "3rd": 81.74464,
    "5th": 82.58135,
    "10th": 83.87245,
    "25th": 86.03703,
    "50th": 88.45247,
    "75th": 90.8787,
    "90th": 93.07143,
    "95th": 94.38775,
    "97th": 95.24419
  },
  {
    age: 26.5,
    "3rd": 82.47365,
    "5th": 83.31105,
    "10th": 84.60576,
    "25th": 86.78329,
    "50th": 89.22326,
    "75th": 91.68468,
    "90th": 93.91817,
    "95th": 95.263,
    "97th": 96.13962
  },
  {
    age: 27.5,
    "3rd": 83.18812,
    "5th": 84.02609,
    "10th": 85.32399,
    "25th": 87.51317,
    "50th": 89.97549,
    "75th": 92.46929,
    "90th": 94.74064,
    "95th": 96.1121,
    "97th": 97.00763
  },
  {
    age: 28.5,
    "3rd": 83.88931,
    "5th": 84.72769,
    "10th": 86.02833,
    "25th": 88.22788,
    "50th": 90.71041,
    "75th": 93.23385,
    "90th": 95.54016,
    "95th": 96.93639,
    "97th": 97.84957
  },
  {
    age: 29.5,
    "3rd": 84.57826,
    "5th": 85.41688,
    "10th": 86.71978,
    "25th": 88.9284,
    "50th": 91.42908,
    "75th": 93.97951,
    "90th": 96.318,
    "95th": 97.73717,
    "97th": 98.66677
  },
  {
    age: 30.5,
    "3rd": 85.25589,
    "5th": 86.09452,
    "10th": 87.39917,
    "25th": 89.6156,
    "50th": 92.13242,
    "75th": 94.70732,
    "90th": 97.07531,
    "95th": 98.51569,
    "97th": 99.46052
  },
  {
    age: 31.5,
    "3rd": 85.92294,
    "5th": 86.76134,
    "10th": 88.06723,
    "25th": 90.2902,
    "50th": 92.82127,
    "75th": 95.41824,
    "90th": 97.81324,
    "95th": 99.27318,
    "97th": 100.2321
  },
  {
    age: 32.5,
    "3rd": 86.58009,
    "5th": 87.41799,
    "10th": 88.72457,
    "25th": 90.95287,
    "50th": 93.49638,
    "75th": 96.11319,
    "90th": 98.53287,
    "95th": 100.0109,
    "97th": 100.9829
  },
  {
    age: 33.5,
    "3rd": 87.22791,
    "5th": 88.06503,
    "10th": 89.37177,
    "25th": 91.60421,
    "50th": 94.15847,
    "75th": 96.79307,
    "90th": 99.23531,
    "95th": 100.73,
    "97th": 101.7142
  },
  {
    age: 34.5,
    "3rd": 87.86696,
    "5th": 88.70301,
    "10th": 90.00937,
    "25th": 92.24482,
    "50th": 94.80823,
    "75th": 97.45873,
    "90th": 99.92162,
    "95th": 101.4318,
    "97th": 102.4274
  },
  {
    age: 35.5,
    "3rd": 88.49774,
    "5th": 89.33242,
    "10th": 90.63786,
    "25th": 92.87525,
    "50th": 95.44637,
    "75th": 98.11108,
    "90th": 100.5929,
    "95th": 102.1174,
    "97th": 103.1237
  }
];

// Females, Ages Birth – 36 Months
const femaleLength = [
  {
    age: 0,
    "3rd": 45.09488,
    "5th": 45.57561,
    "10th": 46.33934,
    "25th": 47.68345,
    "50th": 49.2864,
    "75th": 51.0187,
    "90th": 52.7025,
    "95th": 53.77291,
    "97th": 54.49527
  },
  {
    age: 0.5,
    "3rd": 47.46916,
    "5th": 47.96324,
    "10th": 48.74248,
    "25th": 50.09686,
    "50th": 51.68358,
    "75th": 53.36362,
    "90th": 54.96222,
    "95th": 55.96094,
    "97th": 56.62728
  },
  {
    age: 1.5,
    "3rd": 50.95701,
    "5th": 51.47996,
    "10th": 52.29627,
    "25th": 53.69078,
    "50th": 55.28613,
    "75th": 56.93136,
    "90th": 58.45612,
    "95th": 59.38911,
    "97th": 60.00338
  },
  {
    age: 2.5,
    "3rd": 53.62925,
    "5th": 54.17907,
    "10th": 55.03144,
    "25th": 56.47125,
    "50th": 58.09382,
    "75th": 59.74045,
    "90th": 61.24306,
    "95th": 62.15166,
    "97th": 62.74547
  },
  {
    age: 3.5,
    "3rd": 55.8594,
    "5th": 56.43335,
    "10th": 57.31892,
    "25th": 58.80346,
    "50th": 60.45981,
    "75th": 62.1233,
    "90th": 63.62648,
    "95th": 64.52875,
    "97th": 65.11577
  },
  {
    age: 4.5,
    "3rd": 57.8047,
    "5th": 58.40032,
    "10th": 59.31633,
    "25th": 60.84386,
    "50th": 62.5367,
    "75th": 64.22507,
    "90th": 65.74096,
    "95th": 66.64653,
    "97th": 67.23398
  },
  {
    age: 5.5,
    "3rd": 59.54799,
    "5th": 60.16323,
    "10th": 61.10726,
    "25th": 62.6759,
    "50th": 64.40633,
    "75th": 66.12418,
    "90th": 67.65995,
    "95th": 68.57452,
    "97th": 69.16668
  },
  {
    age: 6.5,
    "3rd": 61.13893,
    "5th": 61.77208,
    "10th": 62.7421,
    "25th": 64.35005,
    "50th": 66.11842,
    "75th": 67.8685,
    "90th": 69.42868,
    "95th": 70.35587,
    "97th": 70.95545
  },
  {
    age: 7.5,
    "3rd": 62.60993,
    "5th": 63.25958,
    "10th": 64.25389,
    "25th": 65.89952,
    "50th": 67.70574,
    "75th": 69.48975,
    "90th": 71.0731,
    "95th": 72.01952,
    "97th": 72.62835
  },
  {
    age: 8.5,
    "3rd": 63.98348,
    "5th": 64.64845,
    "10th": 65.66559,
    "25th": 67.34745,
    "50th": 69.19124,
    "75th": 71.01019,
    "90th": 72.62711,
    "95th": 73.58601,
    "97th": 74.20532
  },
  {
    age: 9.5,
    "3rd": 65.2759,
    "5th": 65.9552,
    "10th": 66.99394,
    "25th": 68.7107,
    "50th": 70.59164,
    "75th": 72.44614,
    "90th": 74.09378,
    "95th": 75.0705,
    "97th": 75.70118
  },
  {
    age: 10.5,
    "3rd": 66.49948,
    "5th": 67.19226,
    "10th": 68.25154,
    "25th": 70.00202,
    "50th": 71.91962,
    "75th": 73.80997,
    "90th": 75.48923,
    "95th": 76.4846,
    "97th": 77.12729
  },
  {
    age: 11.5,
    "3rd": 67.66371,
    "5th": 68.36925,
    "10th": 69.44814,
    "25th": 71.23128,
    "50th": 73.18501,
    "75th": 75.11133,
    "90th": 76.82282,
    "95th": 77.83742,
    "97th": 78.49257
  },
  {
    age: 12.5,
    "3rd": 68.77613,
    "5th": 69.4938,
    "10th": 70.59149,
    "25th": 72.40633,
    "50th": 74.39564,
    "75th": 76.35791,
    "90th": 78.10202,
    "95th": 79.13625,
    "97th": 79.80419
  },
  {
    age: 13.5,
    "3rd": 69.8428,
    "5th": 70.57207,
    "10th": 71.68784,
    "25th": 73.53349,
    "50th": 75.55785,
    "75th": 77.55594,
    "90th": 79.3329,
    "95th": 80.38705,
    "97th": 81.06801
  },
  {
    age: 14.5,
    "3rd": 70.86874,
    "5th": 71.60911,
    "10th": 72.74233,
    "25th": 74.61799,
    "50th": 76.67686,
    "75th": 78.71058,
    "90th": 80.5205,
    "95th": 81.59475,
    "97th": 82.28891
  },
  {
    age: 15.5,
    "3rd": 71.85807,
    "5th": 72.60914,
    "10th": 73.75924,
    "25th": 75.66416,
    "50th": 77.75701,
    "75th": 79.82613,
    "90th": 81.66903,
    "95th": 82.7635,
    "97th": 83.47098
  },
  {
    age: 16.5,
    "3rd": 72.81433,
    "5th": 73.57571,
    "10th": 74.74217,
    "25th": 76.67568,
    "50th": 78.80198,
    "75th": 80.90623,
    "90th": 82.78208,
    "95th": 83.89683,
    "97th": 84.6177
  },
  {
    age: 17.5,
    "3rd": 73.74047,
    "5th": 74.51184,
    "10th": 75.6942,
    "25th": 77.65565,
    "50th": 79.81492,
    "75th": 81.95399,
    "90th": 83.86269,
    "95th": 84.99774,
    "97th": 85.73205
  },
  {
    age: 18.5,
    "3rd": 74.63908,
    "5th": 75.42012,
    "10th": 76.61797,
    "25th": 78.60678,
    "50th": 80.79852,
    "75th": 82.97211,
    "90th": 84.91353,
    "95th": 86.06887,
    "97th": 86.81663
  },
  {
    age: 19.5,
    "3rd": 75.51237,
    "5th": 76.30282,
    "10th": 77.51576,
    "25th": 79.53138,
    "50th": 81.75512,
    "75th": 83.96292,
    "90th": 85.93689,
    "95th": 87.11249,
    "97th": 87.8737
  },
  {
    age: 20.5,
    "3rd": 76.36229,
    "5th": 77.16191,
    "10th": 78.38958,
    "25th": 80.4315,
    "50th": 82.68679,
    "75th": 84.92846,
    "90th": 86.93481,
    "95th": 88.13061,
    "97th": 88.90526
  },
  {
    age: 21.5,
    "3rd": 77.19056,
    "5th": 77.9991,
    "10th": 79.2412,
    "25th": 81.30893,
    "50th": 83.59532,
    "75th": 85.87054,
    "90th": 87.90908,
    "95th": 89.125,
    "97th": 89.91305
  },
  {
    age: 22.5,
    "3rd": 77.99868,
    "5th": 78.81595,
    "10th": 80.07216,
    "25th": 82.16525,
    "50th": 84.48233,
    "75th": 86.79077,
    "90th": 88.86127,
    "95th": 90.09723,
    "97th": 90.89866
  },
  {
    age: 23.5,
    "3rd": 78.78801,
    "5th": 79.61381,
    "10th": 80.88385,
    "25th": 83.00187,
    "50th": 85.34924,
    "75th": 87.69056,
    "90th": 89.79282,
    "95th": 91.04873,
    "97th": 91.86347
  },
  {
    age: 24.5,
    "3rd": 79.55974,
    "5th": 80.39391,
    "10th": 81.67752,
    "25th": 83.82007,
    "50th": 86.19732,
    "75th": 88.57121,
    "90th": 90.70499,
    "95th": 91.98074,
    "97th": 92.80876
  },
  {
    age: 25.5,
    "3rd": 80.33998,
    "5th": 81.18804,
    "10th": 82.49318,
    "25th": 84.67209,
    "50th": 87.09026,
    "75th": 89.50562,
    "90th": 91.67718,
    "95th": 92.97574,
    "97th": 93.81864
  },
  {
    age: 26.5,
    "3rd": 81.11332,
    "5th": 81.97223,
    "10th": 83.29459,
    "25th": 85.5036,
    "50th": 87.95714,
    "75th": 90.40982,
    "90th": 92.61658,
    "95th": 93.93693,
    "97th": 94.79426
  },
  {
    age: 27.5,
    "3rd": 81.87334,
    "5th": 82.74084,
    "10th": 84.07717,
    "25th": 86.31151,
    "50th": 88.79602,
    "75th": 91.28258,
    "90th": 93.52227,
    "95th": 94.86339,
    "97th": 95.73464
  },
  {
    age: 28.5,
    "3rd": 82.61506,
    "5th": 83.48951,
    "10th": 84.83741,
    "25th": 87.09346,
    "50th": 89.60551,
    "75th": 92.12313,
    "90th": 94.39371,
    "95th": 95.75464,
    "97th": 96.63928
  },
  {
    age: 29.5,
    "3rd": 83.33473,
    "5th": 84.21496,
    "10th": 85.57273,
    "25th": 87.84783,
    "50th": 90.38477,
    "75th": 92.93113,
    "90th": 95.23082,
    "95th": 96.61061,
    "97th": 97.50808
  },
  {
    age: 30.5,
    "3rd": 84.02972,
    "5th": 84.91494,
    "10th": 86.28139,
    "25th": 88.57362,
    "50th": 91.13342,
    "75th": 93.70662,
    "90th": 96.03385,
    "95th": 97.43164,
    "97th": 98.34139
  },
  {
    age: 31.5,
    "3rd": 84.69837,
    "5th": 85.58809,
    "10th": 86.96242,
    "25th": 89.27042,
    "50th": 91.85154,
    "75th": 94.45005,
    "90th": 96.80343,
    "95th": 98.2184,
    "97th": 99.13993
  },
  {
    age: 32.5,
    "3rd": 85.33987,
    "5th": 86.23379,
    "10th": 87.6155,
    "25th": 89.93835,
    "50th": 92.53964,
    "75th": 97.54052,
    "90th": 98.97193,
    "95th": 99.90473,
    "97th": 100.6372
  },
  {
    age: 33.5,
    "3rd": 85.95413,
    "5th": 86.85208,
    "10th": 88.24089,
    "25th": 90.57795,
    "50th": 93.19854,
    "75th": 98.24636,
    "90th": 99.69353,
    "95th": 100.6372,
    "97th": 101.3388
  },
  {
    age: 34.5,
    "3rd": 86.54167,
    "5th": 87.44359,
    "10th": 88.83932,
    "25th": 91.1902,
    "50th": 93.82945,
    "75th": 98.92246,
    "90th": 100.3848,
    "95th": 101.3388,
    "97th": 102.0116
  },
  {
    age: 35.5,
    "3rd": 87.10349,
    "5th": 88.00937,
    "10th": 89.41196,
    "25th": 91.77639,
    "50th": 94.43382,
    "75th": 99.57056,
    "90th": 101.0475,
    "95th": 102.0116,
    "97th": 102.7382
  }
];

//Ref:https://www.cdc.gov/growthcharts/html_charts/wtageinf.htm#females
// Males, Birth – 36 Months
const maleWeight = [
  {
    age: 0,
    "3rd": 2.355451,
    "5th": 2.526904,
    "10th": 2.773802,
    "25th": 3.150611,
    "50th": 3.530203,
    "75th": 3.879077,
    "90th": 4.172493,
    "95th": 4.340293,
    "97th": 4.446488
  },
  {
    age: 0.5,
    "3rd": 2.799549,
    "5th": 2.964656,
    "10th": 3.20951,
    "25th": 3.597396,
    "50th": 4.003106,
    "75th": 4.387423,
    "90th": 4.718161,
    "95th": 4.91013,
    "97th": 5.032625
  },
  {
    age: 1.5,
    "3rd": 3.614688,
    "5th": 3.774849,
    "10th": 4.020561,
    "25th": 4.428873,
    "50th": 4.879525,
    "75th": 5.327328,
    "90th": 5.728153,
    "95th": 5.967102,
    "97th": 6.121929
  },
  {
    age: 2.5,
    "3rd": 4.342341,
    "5th": 4.503255,
    "10th": 4.754479,
    "25th": 5.183378,
    "50th": 5.672889,
    "75th": 6.175598,
    "90th": 6.638979,
    "95th": 6.921119,
    "97th": 7.10625
  },
  {
    age: 3.5,
    "3rd": 4.992898,
    "5th": 5.157412,
    "10th": 5.416803,
    "25th": 5.866806,
    "50th": 6.391392,
    "75th": 6.942217,
    "90th": 7.460702,
    "95th": 7.781401,
    "97th": 7.993878
  },
  {
    age: 4.5,
    "3rd": 5.575169,
    "5th": 5.744752,
    "10th": 6.013716,
    "25th": 6.484969,
    "50th": 7.041836,
    "75th": 7.635323,
    "90th": 8.202193,
    "95th": 8.556813,
    "97th": 8.793444
  },
  {
    age: 5.5,
    "3rd": 6.096775,
    "5th": 6.272175,
    "10th": 6.551379,
    "25th": 7.043627,
    "50th": 7.630425,
    "75th": 8.262033,
    "90th": 8.871384,
    "95th": 9.255615,
    "97th": 9.513307
  },
  {
    age: 6.5,
    "3rd": 6.56443,
    "5th": 6.745993,
    "10th": 7.035656,
    "25th": 7.548346,
    "50th": 8.162951,
    "75th": 8.828786,
    "90th": 9.475466,
    "95th": 9.885436,
    "97th": 10.16135
  },
  {
    age: 7.5,
    "3rd": 6.984123,
    "5th": 7.171952,
    "10th": 7.472021,
    "25th": 8.004399,
    "50th": 8.644832,
    "75th": 9.34149,
    "90th": 10.02101,
    "95th": 10.45331,
    "97th": 10.74492
  },
  {
    age: 8.5,
    "3rd": 7.361236,
    "5th": 7.555287,
    "10th": 7.865533,
    "25th": 8.416719,
    "50th": 9.08112,
    "75th": 9.805593,
    "90th": 10.51406,
    "95th": 10.96574,
    "97th": 11.27084
  },
  {
    age: 9.5,
    "3rd": 7.700624,
    "5th": 7.900755,
    "10th": 8.220839,
    "25th": 8.789882,
    "50th": 9.4765,
    "75th": 10.22612,
    "90th": 10.96017,
    "95th": 11.42868,
    "97th": 11.74538
  },
  {
    age: 10.5,
    "3rd": 8.006677,
    "5th": 8.212684,
    "10th": 8.542195,
    "25th": 9.12811,
    "50th": 9.835308,
    "75th": 10.60772,
    "90th": 11.36445,
    "95th": 11.84763,
    "97th": 12.17436
  },
  {
    age: 11.5,
    "3rd": 8.283365,
    "5th": 8.495,
    "10th": 8.833486,
    "25th": 9.435279,
    "50th": 10.16154,
    "75th": 10.95466,
    "90th": 11.7316,
    "95th": 12.2766,
    "97th": 12.56308
  },
  {
    age: 12.5,
    "3rd": 8.534275,
    "5th": 8.751264,
    "10th": 9.098246,
    "25th": 9.714942,
    "50th": 10.45885,
    "75th": 11.27087,
    "90th": 12.06595,
    "95th": 12.5734,
    "97th": 12.91645
  },
  {
    age: 13.5,
    "3rd": 8.762649,
    "5th": 8.984701,
    "10th": 9.339688,
    "25th": 9.970338,
    "50th": 10.73063,
    "75th": 11.55996,
    "90th": 12.37145,
    "95th": 12.88911,
    "97th": 13.23893
  },
  {
    age: 14.5,
    "3rd": 8.971407,
    "5th": 9.198222,
    "10th": 9.560722,
    "25th": 10.20442,
    "50th": 10.97992,
    "75th": 11.82524,
    "90th": 12.65175,
    "95th": 13.17867,
    "97th": 13.53462
  },
  {
    age: 15.5,
    "3rd": 9.16318,
    "5th": 9.394454,
    "10th": 9.763982,
    "25th": 10.41986,
    "50th": 11.20956,
    "75th": 12.06973,
    "90th": 12.91015,
    "95th": 13.44564,
    "97th": 13.80724
  },
  {
    age: 16.5,
    "3rd": 9.340328,
    "5th": 9.575757,
    "10th": 9.95184,
    "25th": 10.6191,
    "50th": 11.42207,
    "75th": 12.29617,
    "90th": 13.14969,
    "95th": 13.69325,
    "97th": 14.06019
  },
  {
    age: 17.5,
    "3rd": 9.504964,
    "5th": 9.744251,
    "10th": 10.12643,
    "25th": 10.80433,
    "50th": 11.61978,
    "75th": 12.50708,
    "90th": 13.37311,
    "95th": 13.92444,
    "97th": 14.29655
  },
  {
    age: 18.5,
    "3rd": 9.658975,
    "5th": 9.90183,
    "10th": 10.28968,
    "25th": 10.97753,
    "50th": 11.80478,
    "75th": 12.70473,
    "90th": 13.5829,
    "95th": 14.14187,
    "97th": 14.51909
  },
  {
    age: 19.5,
    "3rd": 9.804039,
    "5th": 10.05019,
    "10th": 10.4433,
    "25th": 11.14047,
    "50th": 11.97897,
    "75th": 12.89117,
    "90th": 13.78133,
    "95th": 14.34795,
    "97th": 14.73034
  },
  {
    age: 20.5,
    "3rd": 9.941645,
    "5th": 10.19082,
    "10th": 10.58881,
    "25th": 11.29477,
    "50th": 12.14404,
    "75th": 13.06825,
    "90th": 13.97042,
    "95th": 14.54484,
    "97th": 14.93256
  },
  {
    age: 21.5,
    "3rd": 10.07311,
    "5th": 10.32507,
    "10th": 10.72759,
    "25th": 11.44185,
    "50th": 12.30154,
    "75th": 13.23765,
    "90th": 14.15201,
    "95th": 14.73448,
    "97th": 15.12777
  },
  {
    age: 22.5,
    "3rd": 10.19957,
    "5th": 10.4541,
    "10th": 10.86084,
    "25th": 11.58298,
    "50th": 12.45283,
    "75th": 13.40086,
    "90th": 14.32772,
    "95th": 14.91861,
    "97th": 15.31777
  },
  {
    age: 23.5,
    "3rd": 10.32206,
    "5th": 10.57895,
    "10th": 10.98963,
    "25th": 11.7193,
    "50th": 12.59913,
    "75th": 13.5592,
    "90th": 14.499,
    "95th": 15.09876,
    "97th": 15.50418
  },
  {
    age: 24.5,
    "3rd": 10.44144,
    "5th": 10.70051,
    "10th": 11.1149,
    "25th": 11.85182,
    "50th": 12.74154,
    "75th": 13.71386,
    "90th": 14.66716,
    "95th": 15.2763,
    "97th": 15.68841
  },
  {
    age: 25.5,
    "3rd": 10.55847,
    "5th": 10.81958,
    "10th": 11.23747,
    "25th": 11.98142,
    "50th": 12.88102,
    "75th": 13.8659,
    "90th": 14.83332,
    "95th": 15.45242,
    "97th": 15.8717
  },
  {
    age: 26.5,
    "3rd": 10.6738,
    "5th": 10.93681,
    "10th": 11.35806,
    "25th": 12.10889,
    "50th": 13.01842,
    "75th": 14.01623,
    "90th": 14.99848,
    "95th": 15.62819,
    "97th": 16.05514
  },
  {
    age: 27.5,
    "3rd": 10.78798,
    "5th": 11.0528,
    "10th": 11.47728,
    "25th": 12.23491,
    "50th": 13.1545,
    "75th": 14.16567,
    "90th": 15.16351,
    "95th": 15.8045,
    "97th": 16.23967
  },
  {
    age: 28.5,
    "3rd": 10.90147,
    "5th": 11.16803,
    "10th": 11.59567,
    "25th": 12.36007,
    "50th": 13.2899,
    "75th": 14.31493,
    "90th": 15.32917,
    "95th": 15.98214,
    "97th": 16.42609
  },
  {
    age: 29.5,
    "3rd": 11.01466,
    "5th": 11.28293,
    "10th": 11.71368,
    "25th": 12.4849,
    "50th": 13.42519,
    "75th": 14.46462,
    "90th": 15.4961,
    "95th": 16.16177,
    "97th": 16.61508
  },
  {
    age: 30.5,
    "3rd": 11.12787,
    "5th": 11.39782,
    "10th": 11.8317,
    "25th": 12.60983,
    "50th": 13.56088,
    "75th": 14.61527,
    "90th": 15.66485,
    "95th": 16.34395,
    "97th": 16.8072
  },
  {
    age: 31.5,
    "3rd": 11.24135,
    "5th": 11.513,
    "10th": 11.95005,
    "25th": 12.73523,
    "50th": 13.69738,
    "75th": 14.76732,
    "90th": 15.83588,
    "95th": 16.52915,
    "97th": 17.00291
  },
  {
    age: 32.5,
    "3rd": 11.3553,
    "5th": 11.62869,
    "10th": 12.069,
    "25th": 12.86144,
    "50th": 13.83505,
    "75th": 14.92117,
    "90th": 16.00958,
    "95th": 16.71773,
    "97th": 17.2026
  },
  {
    age: 33.5,
    "3rd": 11.46988,
    "5th": 11.74508,
    "10th": 12.18875,
    "25th": 12.9887,
    "50th": 13.97418,
    "75th": 15.0711,
    "90th": 16.18624,
    "95th": 16.91,
    "97th": 17.40654
  },
  {
    age: 34.5,
    "3rd": 11.58521,
    "5th": 11.8623,
    "10th": 12.30948,
    "25th": 13.11723,
    "50th": 14.11503,
    "75th": 15.23541,
    "90th": 16.36612,
    "95th": 17.10619,
    "97th": 17.61495
  },
  {
    age: 35.5,
    "3rd": 11.70137,
    "5th": 11.98046,
    "10th": 12.43132,
    "25th": 13.24721,
    "50th": 14.2578,
    "75th": 15.39628,
    "90th": 16.5494,
    "95th": 17.30646,
    "97th": 17.82797
  },
  {
    age: 36,
    "3rd": 11.75978,
    "5th": 12.03991,
    "10th": 12.49268,
    "25th": 13.31278,
    "50th": 14.32994,
    "75th": 15.47772,
    "90th": 16.64237,
    "95th": 17.40816,
    "97th": 17.93625
  }
];

// Females, Birth – 36 Months
const femaleWeight = [
  {
    age: 0,
    "3rd": 2.414112,
    "5th": 2.547905,
    "10th": 2.747222,
    "25th": 3.064865,
    "50th": 3.399186,
    "75th": 3.717519,
    "90th": 3.992572,
    "95th": 4.152637,
    "97th": 4.254922
  },
  {
    age: 0.5,
    "3rd": 2.756917,
    "5th": 2.894442,
    "10th": 3.101767,
    "25th": 3.437628,
    "50th": 3.797528,
    "75th": 4.145594,
    "90th": 4.450126,
    "95th": 4.628836,
    "97th": 4.743582
  },
  {
    age: 1.5,
    "3rd": 3.402293,
    "5th": 3.54761,
    "10th": 3.770157,
    "25th": 4.138994,
    "50th": 4.544777,
    "75th": 4.946766,
    "90th": 5.305632,
    "95th": 5.519169,
    "97th": 5.657379
  },
  {
    age: 2.5,
    "3rd": 3.997806,
    "5th": 4.150639,
    "10th": 4.387042,
    "25th": 4.78482,
    "50th": 5.230584,
    "75th": 5.680083,
    "90th": 6.087641,
    "95th": 6.332837,
    "97th": 6.492574
  },
  {
    age: 3.5,
    "3rd": 4.547383,
    "5th": 4.707123,
    "10th": 4.955926,
    "25th": 5.379141,
    "50th": 5.859961,
    "75th": 6.351512,
    "90th": 6.80277,
    "95th": 7.076723,
    "97th": 7.256166
  },
  {
    age: 4.5,
    "3rd": 5.054539,
    "5th": 5.220488,
    "10th": 5.480295,
    "25th": 5.925888,
    "50th": 6.437588,
    "75th": 6.966524,
    "90th": 7.457119,
    "95th": 7.787234,
    "97th": 7.95473
  },
  {
    age: 5.5,
    "3rd": 5.5225,
    "5th": 5.693974,
    "10th": 5.96351,
    "25th": 6.428828,
    "50th": 6.96785,
    "75th": 7.53018,
    "90th": 8.056331,
    "95th": 8.38033,
    "97th": 8.594413
  },
  {
    age: 6.5,
    "3rd": 5.954272,
    "5th": 6.130641,
    "10th": 6.408775,
    "25th": 6.891533,
    "50th": 7.454854,
    "75th": 8.047178,
    "90th": 8.605636,
    "95th": 8.951544,
    "97th": 9.180938
  },
  {
    age: 7.5,
    "3rd": 6.352668,
    "5th": 6.533373,
    "10th": 6.819122,
    "25th": 7.317373,
    "50th": 7.902436,
    "75th": 8.521877,
    "90th": 9.109878,
    "95th": 9.476009,
    "97th": 9.719621
  },
  {
    age: 8.5,
    "3rd": 6.720328,
    "5th": 6.904886,
    "10th": 7.197414,
    "25th": 7.709516,
    "50th": 8.314178,
    "75th": 8.958324,
    "90th": 9.573546,
    "95th": 9.95848,
    "97th": 10.21539
  },
  {
    age: 9.5,
    "3rd": 7.059732,
    "5th": 7.247736,
    "10th": 7.546342,
    "25th": 8.070932,
    "50th": 8.693418,
    "75th": 9.360271,
    "90th": 10.00079,
    "95th": 10.40335,
    "97th": 10.6728
  },
  {
    age: 10.5,
    "3rd": 7.373212,
    "5th": 7.564327,
    "10th": 7.868436,
    "25th": 8.4044,
    "50th": 9.043262,
    "75th": 9.731193,
    "90th": 10.39545,
    "95th": 10.8147,
    "97th": 11.09607
  },
  {
    age: 11.5,
    "3rd": 7.662959,
    "5th": 7.856916,
    "10th": 8.166069,
    "25th": 8.712513,
    "50th": 9.366594,
    "75th": 10.07431,
    "90th": 10.76106,
    "95th": 11.19625,
    "97th": 11.48908
  },
  {
    age: 12.5,
    "3rd": 7.93103,
    "5th": 8.127621,
    "10th": 8.44146,
    "25th": 8.997692,
    "50th": 9.666089,
    "75th": 10.39258,
    "90th": 11.10089,
    "95th": 11.55145,
    "97th": 11.85539
  },
  {
    age: 13.5,
    "3rd": 8.179356,
    "5th": 8.378425,
    "10th": 8.696684,
    "25th": 9.262185,
    "50th": 9.944226,
    "75th": 10.68874,
    "90th": 11.41792,
    "95th": 11.88348,
    "97th": 12.19829
  },
  {
    age: 14.5,
    "3rd": 8.409744,
    "5th": 8.611186,
    "10th": 8.93368,
    "25th": 9.508085,
    "50th": 10.20329,
    "75th": 10.96532,
    "90th": 11.71491,
    "95th": 12.19522,
    "97th": 12.52078
  },
  {
    age: 15.5,
    "3rd": 8.623887,
    "5th": 8.827638,
    "10th": 9.154251,
    "25th": 9.737329,
    "50th": 10.4541,
    "75th": 11.2463,
    "90th": 11.99438,
    "95th": 12.48934,
    "97th": 12.82561
  },
  {
    age: 16.5,
    "3rd": 8.82337,
    "5th": 9.029399,
    "10th": 9.360079,
    "25th": 9.951715,
    "50th": 10.67251,
    "75th": 11.46878,
    "90th": 12.25862,
    "95th": 12.76825,
    "97th": 13.1527
  },
  {
    age: 17.5,
    "3rd": 9.009668,
    "5th": 9.21798,
    "10th": 9.552723,
    "25th": 10.1529,
    "50th": 10.88639,
    "75th": 11.69972,
    "90th": 12.50974,
    "95th": 13.03415,
    "97th": 13.39204
  },
  {
    age: 18.5,
    "3rd": 9.18416,
    "5th": 9.394782,
    "10th": 9.73363,
    "25th": 10.34241,
    "50th": 11.08868,
    "75th": 11.91921,
    "90th": 12.74964,
    "95th": 13.28904,
    "97th": 13.65799
  },
  {
    age: 19.5,
    "3rd": 9.348127,
    "5th": 9.56111,
    "10th": 9.90414,
    "25th": 10.52167,
    "50th": 11.2809,
    "75th": 12.12887,
    "90th": 12.98004,
    "95th": 13.53473,
    "97th": 13.91497
  },
  {
    age: 20.5,
    "3rd": 9.50276,
    "5th": 9.71817,
    "10th": 10.06549,
    "25th": 10.69196,
    "50th": 11.4644,
    "75th": 12.33016,
    "90th": 13.2025,
    "95th": 13.77284,
    "97th": 14.16467
  },
  {
    age: 21.5,
    "3rd": 9.649162,
    "5th": 9.867081,
    "10th": 10.21882,
    "25th": 10.85446,
    "50th": 11.64043,
    "75th": 12.52439,
    "90th": 13.41844,
    "95th": 14.00484,
    "97th": 14.40858
  },
  {
    age: 22.5,
    "3rd": 9.788355,
    "5th": 10.00887,
    "10th": 10.36518,
    "25th": 11.01027,
    "50th": 11.81014,
    "75th": 12.71277,
    "90th": 13.62911,
    "95th": 14.23205,
    "97th": 14.64807
  },
  {
    age: 23.5,
    "3rd": 9.921281,
    "5th": 10.1445,
    "10th": 10.50553,
    "25th": 11.16037,
    "50th": 11.97454,
    "75th": 12.89636,
    "90th": 13.83564,
    "95th": 14.45561,
    "97th": 14.88432
  },
  {
    age: 24.5,
    "3rd": 10.04881,
    "5th": 10.27483,
    "10th": 10.64076,
    "25th": 11.30567,
    "50th": 12.13456,
    "75th": 13.07613,
    "90th": 14.03902,
    "95th": 14.67659,
    "97th": 15.11839
  },
  {
    age: 25.5,
    "3rd": 10.17173,
    "5th": 10.40066,
    "10th": 10.77167,
    "25th": 11.44697,
    "50th": 12.29102,
    "75th": 13.25293,
    "90th": 14.24017,
    "95th": 14.89587,
    "97th": 15.35122
  },
  {
    age: 26.5,
    "3rd": 10.29079,
    "5th": 10.52274,
    "10th": 10.89899,
    "25th": 11.58501,
    "50th": 12.44469,
    "75th": 13.42753,
    "90th": 14.43984,
    "95th": 15.11428,
    "97th": 15.58363
  },
  {
    age: 27.5,
    "3rd": 10.40664,
    "5th": 10.64171,
    "10th": 11.02338,
    "25th": 11.72047,
    "50th": 12.59622,
    "75th": 13.60059,
    "90th": 14.63873,
    "95th": 15.33249,
    "97th": 15.81632
  },
  {
    age: 28.5,
    "3rd": 10.5199,
    "5th": 10.75819,
    "10th": 11.14545,
    "25th": 11.85392,
    "50th": 12.74621,
    "75th": 13.77271,
    "90th": 14.83743,
    "95th": 15.55113,
    "97th": 16.0499
  },
  {
    age: 29.5,
    "3rd": 10.63112,
    "5th": 10.87273,
    "10th": 11.26575,
    "25th": 11.98592,
    "50th": 12.89517,
    "75th": 13.9444,
    "90th": 15.03646,
    "95th": 15.7707,
    "97th": 16.28491
  },
  {
    age: 30.5,
    "3rd": 10.74078,
    "5th": 10.98581,
    "10th": 11.38474,
    "25th": 12.11692,
    "50th": 13.04357,
    "75th": 14.11611,
    "90th": 15.23626,
    "95th": 15.99164,
    "97th": 16.52176
  },
  {
    age: 31.5,
    "3rd": 10.84935,
    "5th": 11.09789,
    "10th": 11.50288,
    "25th": 12.24735,
    "50th": 13.19181,
    "75th": 14.28822,
    "90th": 15.43719,
    "95th": 16.21432,
    "97th": 16.76085
  },
  {
    age: 32.5,
    "3rd": 10.95722,
    "5th": 11.20934,
    "10th": 11.62054,
    "25th": 12.37757,
    "50th": 13.34023,
    "75th": 14.46106,
    "90th": 15.63957,
    "95th": 16.43904,
    "97th": 17.00245
  },
  {
    age: 33.5,
    "3rd": 11.06475,
    "5th": 11.32054,
    "10th": 11.73806,
    "25th": 12.50791,
    "50th": 13.48913,
    "75th": 14.63491,
    "90th": 15.84365,
    "95th": 16.66605,
    "97th": 17.24681
  },
  {
    age: 34.5,
    "3rd": 11.17225,
    "5th": 11.43177,
    "10th": 11.85574,
    "25th": 12.63865,
    "50th": 13.63877,
    "75th": 14.80998,
    "90th": 16.04963,
    "95th": 16.89553,
    "97th": 17.49412
  },
  {
    age: 35.5,
    "3rd": 11.28,
    "5th": 11.54332,
    "10th": 11.97384,
    "25th": 12.77001,
    "50th": 13.78937,
    "75th": 14.98647,
    "90th": 16.25767,
    "95th": 17.12762,
    "97th": 17.7445
  },
  {
    age: 36,
    "3rd": 11.33404,
    "5th": 11.59929,
    "10th": 12.03312,
    "25th": 12.836,
    "50th": 13.86507,
    "75th": 15.07529,
    "90th": 16.3625,
    "95th": 17.24469,
    "97th": 17.87089
  }
];

