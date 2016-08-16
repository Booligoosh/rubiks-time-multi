document.getElementById("time1").style = "opacity: 0; filter: alpha(opacity=0);";
document.getElementById("time2").style = "opacity: 0; filter: alpha(opacity=0);";
document.getElementById("time3").style = "opacity: 0; filter: alpha(opacity=0);";
document.getElementById("time4").style = "opacity: 0; filter: alpha(opacity=0);";
if (localStorage.rubiksMulti == undefined) {
  var startDown = false;
  var startUp = false;
  var inspectionStarted = false;
  var solveStarted = false;
  var currentScreen = 1;
  var prevScreen;
  var screenBeforeStats;
  var backgroundNum = 0;
  var backgroundRGBs = ["229, 57, 53", "244, 81, 30", "57, 73, 171", "67, 160, 71", "255, 179, 0", "117, 117, 117"];
  var backgroundNames = ["Red", "Orange", "Blue", "Green", "Yellow", "Grey"];
  var backgroundRGB = "229, 57, 53";
  var backgroundName = "Red";
  var solves1 = [];
  var solves2 = [];
  var solves3 = [];
  var solves4 = [];
  var inspectionStartOn = 15;
  var inspection;
  var inspectionInterval;
  var inspectionTimer;
  var solve;
  var solveMinutes;
  var solveSeconds;
  var solveHundredths;
  var solveSecondsRaw;
  var solveHundredthsRaw;
  var solveInterval;
  var solveTimer;
  var solvesListLoop;
  var playersDone = 0;
  var player1done = false;
  var player2done = false;
  var player3done = false;
  var player4done = false;
  var chartLoop;
  var chartArray;
  localStorage.rubiksMulti = true;
}
else {
  //Normal init with localStorage vars missing
  var startDown = false;
  var startUp = false;
  var inspectionStarted = false;
  var solveStarted = false;
  var currentScreen = 1;
  var prevScreen;
  var screenBeforeStats;
  var backgroundRGBs = ["229, 57, 53", "244, 81, 30", "57, 73, 171", "67, 160, 71", "255, 179, 0", "117, 117, 117"];
  var backgroundNames = ["Red", "Orange", "Blue", "Green", "Yellow", "Grey"];
  var backgroundRGB;
  var backgroundName;
  var inspection;
  var inspectionInterval;
  var inspectionTimer;
  var solve;
  var solveMinutes;
  var solveSeconds;
  var solveHundredths;
  var solveSecondsRaw;
  var solveHundredthsRaw;
  var solveInterval;
  var solveTimer;
  var solvesListLoop;
  var playersDone = 0;
  var player1done = false;
  var player2done = false;
  var player3done = false;
  var player4done = false;
  var chartLoop;
  var chartArray;
  //localStorage vars
  if (typeof(Storage) !== "undefined") {
    var inspectionStartOn = Number(localStorage.rubiksMultiInspectionStartOn);
    document.getElementById("inspection").innerHTML = inspectionStartOn.toString();
    var backgroundNum = Number(localStorage.rubiksMultiBackgroundNum);
    backgroundChange();
    var solves1 = localStorage.rubiksMultiSolves1.split(',');
    var solves2 = localStorage.rubiksMultiSolves2.split(',');
    var solves3 = localStorage.rubiksMultiSolves3.split(',');
    var solves4 = localStorage.rubiksMultiSolves4.split(',');
  }
  else {
    var cookiesList = document.cookie.split("|");
    var inspectionStartOn = Number(cookiesList[1]);
    document.getElementById("inspection").innerHTML = inspectionStartOn.toString();
    var backgroundNum = Number(cookiesList[2]);
    backgroundChange();
    var solves1 = cookiesList[3].split(',');
    var solves2 = cookiesList[4].split(',');
    var solves3 = cookiesList[5].split(',');
    var solves4 = cookiesList[6].split(',');
  }

}

document.getElementById("scramble").innerHTML = scramblers["333"].getRandomScramble().scramble_string;

Array.min = function( array ){
    return Math.min.apply( Math, array );
};

function showScreen(num) {
  document.getElementById("screen1").style.display = "none";
  document.getElementById("screen2").style.display = "none";
  document.getElementById("screen3").style.display = "none";
  document.getElementById("screen4").style.display = "none";
  document.getElementById("screen5").style.display = "none";
  document.getElementById("screen6").style.display = "none";
  document.getElementById("screen" + num).style.display = "block";
  if (num === 1 || num === 2) {
    document.getElementById("key").style.display = "block";
    document.getElementById("scramble").style = "-webkit-filter: opacity(100); filter: opacity(100);";
  }
  else {
    document.getElementById("key").style.display = "none";
    document.getElementById("scramble").style = "-webkit-filter: opacity(0); filter: opacity(0);";
  }
  prevScreen = currentScreen;
  currentScreen = num;
}

function startInspection() {
  inspectionInterval = 1;  // 1 Second
  inspection = inspection - 1;
  document.getElementById("numbers").innerHTML = inspection.toString();
  if (inspection === 0) {
    solve = 0;
    solveStarted = true;
    startSolve();
    clearTimeout(inspectionTimer);
  }
  inspectionTimer = setTimeout(startInspection, inspectionInterval*1000);
}

function stopInspection() {
  clearTimeout(inspectionTimer);
}

function startSolve() {
  clearTimeout(inspectionTimer);
  solveInterval = 10;  // 10 thousandths of a second (1 hundredth)
  solve = solve + 1;
  document.getElementById("numbers").innerHTML = clockify(solve);
  document.getElementById("scramble").style = "-webkit-filter: opacity(100); filter: opacity(100);";
  solveTimer = setTimeout(startSolve, solveInterval);
}

function stopSolve() {
  clearTimeout(solveTimer);
  //solves.push(solve);
  updateStorage();
  document.getElementById("screen2sub").style.display = "block";
  document.getElementById("screen2sub").innerHTML = "Ready";
  document.getElementById("numbers").innerHTML = clockify(solve);
  document.getElementById("scramble").style = "-webkit-filter: opacity(0); filter: opacity(0);";
  newSolve();
}

function clockify(num) {
  var minRaw = num / 6000;
  var min = Math.floor(minRaw);
  var secRaw = (minRaw - min) * 60;
  var sec = Math.floor(secRaw);
  var hundRaw = (secRaw - sec) * 100;
  var hund = Math.floor(hundRaw);
  if (min.toString().length <  2) {
    min = "0" + min;
  }
  if (sec.toString().length <  2) {
    sec = "0" + sec;
  }
  if (hund.toString().length <  2) {
    hund = "0" + hund;
  }
  return(min + ":" + sec + "." + hund);
}

function keyDown() {
  if (currentScreen === 1 || currentScreen === 2) {
    //space
    if (event.keyCode === 32) {
      if (startDown === false) {
        showScreen(2);
        document.getElementById("screen2sub").style.display = "none";
        document.getElementById("numbers").innerHTML = "Ready";
        document.getElementById("time1").style = "opacity: 0; filter: alpha(opacity=0);";
        document.getElementById("time2").style = "opacity: 0; filter: alpha(opacity=0);";
        document.getElementById("time3").style = "opacity: 0; filter: alpha(opacity=0);";
        document.getElementById("time4").style = "opacity: 0; filter: alpha(opacity=0);";
        startDown = true;
      }
      if (inspectionStarted === true && solveStarted === false) {
        solve = 0;
        solveStarted = true;
        startSolve();
        clearTimeout(inspectionTimer);
      }
    }
    //left
    if (event.keyCode === 37) {
      if (solveStarted === true && player1done === false) {
        player1done = true;
        document.getElementById("1").style = "-webkit-filter: brightness(100%); filter: brightness(100%);";
        solves1.push(solve);
        document.getElementById("time1").style = "opacity: 1; filter: alpha(opacity=1);";
        document.getElementById("time1").innerHTML = clockify(solves1[solves1.length - 1]);
        playersDone = playersDone + 1;
        if (playersDone >= 4) {
          stopSolve();
        }
      }
    }
    //up
    if (event.keyCode === 38) {
      if (solveStarted === true && player2done === false) {
        player2done = true;
        document.getElementById("2").style = "-webkit-filter: brightness(100%); filter: brightness(100%);";
        solves2.push(solve);
        document.getElementById("time2").style = "opacity: 1; filter: alpha(opacity=1);";
        document.getElementById("time2").innerHTML = clockify(solves2[solves2.length - 1]);
        playersDone = playersDone + 1;
        if (playersDone >= 4) {
          stopSolve();
        }
      }
    }
    //right
    if (event.keyCode === 39) {
      if (solveStarted === true && player3done === false) {
        player3done = true;
        document.getElementById("3").style = "-webkit-filter: brightness(100%); filter: brightness(100%);";
        solves3.push(solve);
        document.getElementById("time3").style = "opacity: 1; filter: alpha(opacity=1);";
        document.getElementById("time3").innerHTML = clockify(solves3[solves3.length - 1]);
        playersDone = playersDone + 1;
        if (playersDone >= 4) {
          stopSolve();
        }
      }
    }
    //down
    if (event.keyCode === 40) {
      if (solveStarted === true && player4done === false) {
        player4done = true;
        document.getElementById("4").style = "-webkit-filter: brightness(100%); filter: brightness(100%);";
        solves4.push(solve);
        document.getElementById("time4").style = "opacity: 1; filter: alpha(opacity=1);";
        document.getElementById("time4").innerHTML = clockify(solves4[solves4.length - 1]);
        playersDone = playersDone + 1;
        if (playersDone >= 4) {
          stopSolve();
        }
      }
    }
  }
}

function keyUp() {
  if (currentScreen === 1 || currentScreen === 2) {
    //space
    if (event.keyCode === 32) {
      if (startDown === true && inspectionStarted === false) {
        document.getElementById("1").style = "-webkit-filter: brightness(0%); filter: brightness(0%);";
        document.getElementById("2").style = "-webkit-filter: brightness(0%); filter: brightness(0%);";
        document.getElementById("3").style = "-webkit-filter: brightness(0%); filter: brightness(0%);";
        document.getElementById("4").style = "-webkit-filter: brightness(0%); filter: brightness(0%);";
        inspection = inspectionStartOn + 1;
        inspectionStarted = true;
        startInspection();
      }
    }
  }
}

function gearClicked() {
  if (document.getElementById("screen4").style.display === "none" && document.getElementById("screen5").style.display === "none" && document.getElementById("screen6").style.display === "none") {
    if (document.getElementById("screen3").style.display === "none") {
      document.getElementById("gear").src = "https://booligoosh.github.io/rubiks-time/left.svg";
      showScreen(3);
    }
    else {
      document.getElementById("gear").src = "https://booligoosh.github.io/rubiks-time/gear.svg";
      showScreen(prevScreen);
    }
  }
}

function statsClicked() {
  if (document.getElementById("screen3").style.display === "none") {
    if (document.getElementById("screen4").style.display === "none" && document.getElementById("screen5").style.display === "none" && document.getElementById("screen6").style.display === "none") {
      document.getElementById("stats").src = "https://booligoosh.github.io/rubiks-time/left.svg";
      screenBeforeStats = currentScreen;
      showScreen(4);
    }
    else if (document.getElementById("screen4").style.display === "none") {
      showScreen(4);
    }
    else {
      document.getElementById("stats").src = "https://booligoosh.github.io/rubiks-time/stats.svg";
      showScreen(screenBeforeStats);
    }
  }
}

function solvesList() {
  document.getElementById("solveslist").innerHTML = "";
  addToTable("solveslist",["Cuber 1", "Cuber 2", "Cuber 3", "Cuber 4"]);
  document.getElementById("solvescount").innerHTML = solves1.length + " solves so far.";
  solvesListLoop = -1;
  while (solvesListLoop < solves1.length - 1) {
    solvesListLoop = solvesListLoop + 1;
    addToTable("solveslist",[clockify(solves1[solvesListLoop]), clockify(solves2[solvesListLoop]), clockify(solves3[solvesListLoop]), clockify(solves4[solvesListLoop])]);
    document.getElementById("solvescount").innerHTML = solves1.length + " solves so far.";
  }
  showScreen(5);
}

function moreStats() {
  chartArray = [['Solve number', 'Cuber 1', 'Cuber 2', 'Cuber 3', 'Cuber 4']];
  chartLoop = 0;
  while (chartLoop < solves1.length) {
    chartArray.push(["Solve " + (chartLoop + 1), Number(solves1[chartLoop]) / 100, Number(solves2[chartLoop]) / 100, Number(solves3[chartLoop]) / 100, Number(solves4[chartLoop]) / 100]);
    //OLD CHART FORMAT: chartArray.push(["Solve " + (chartLoop + 1), Number(solves1[chartLoop]) / 100]);
    chartLoop = chartLoop + 1;
  }
  showScreen(6);
  addToTable("morestats", ["", "Cuber 1", "Cuber 2", "Cuber 3", "Cuber 4"]);
  addToTable("morestats", ["Average", clockify(averageOfArray(solves1)), clockify(averageOfArray(solves2)), clockify(averageOfArray(solves3)), clockify(averageOfArray(solves4))]);
  if (solves1.length >= 5) {
    var averagesOfFive1 = averageOfFivesOfArray(solves1);
    var averagesOfFive2 = averageOfFivesOfArray(solves2);
    var averagesOfFive3 = averageOfFivesOfArray(solves3);
    var averagesOfFive4 = averageOfFivesOfArray(solves4);
    addToTable("morestats", ["Current average of 5", clockify(averagesOfFive1[averagesOfFive1.length - 1]), clockify(averagesOfFive2[averagesOfFive2.length - 1]), clockify(averagesOfFive3[averagesOfFive3.length - 1]), clockify(averagesOfFive4[averagesOfFive4.length - 1])]);
    addToTable("morestats", ["Best average of 5", clockify(Array.min(averagesOfFive1)), clockify(Array.min(averagesOfFive2)), clockify(Array.min(averagesOfFive3)), clockify(Array.min(averagesOfFive4))]);
  }
  if (solves1.length >= 5) {
    var averagesOfTwelve1 = averageOfTwelvesOfArray(solves1);
    var averagesOfTwelve2 = averageOfTwelvesOfArray(solves2);
    var averagesOfTwelve3 = averageOfTwelvesOfArray(solves3);
    var averagesOfTwelve4 = averageOfTwelvesOfArray(solves4);
    addToTable("morestats", ["Current average of 12", clockify(averagesOfTwelve1[averagesOfTwelve1.length - 1]), clockify(averagesOfTwelve2[averagesOfTwelve2.length - 1]), clockify(averagesOfTwelve3[averagesOfTwelve3.length - 1]), clockify(averagesOfTwelve4[averagesOfTwelve4.length - 1])]);
    addToTable("morestats", ["Best average of 12", clockify(Array.min(averagesOfTwelve1)), clockify(Array.min(averagesOfTwelve2)), clockify(Array.min(averagesOfTwelve3)), clockify(Array.min(averagesOfTwelve4))]);
  }
  drawChart();
}

function averageOfArray(array) {
  var total = 0;
  var averageLoop = 0;
  while (averageLoop < array.length) {
    total = total + Number(array[averageLoop]);
    averageLoop = averageLoop + 1;
  }
  return(total / array.length);
}

function averageOfFivesOfArray(array) {
  var fiveArray = 0;
  var fiveLoop = 0;
  var averagesOfFive = [];
  while (fiveLoop < array.length - 4) {
    fiveArray = [Number(array[fiveLoop]), Number(array[fiveLoop + 1]), Number(array[fiveLoop + 2]), Number(array[fiveLoop + 3]), Number(array[fiveLoop + 4])];
    averagesOfFive.push(averageOfArray(fiveArray));
    fiveLoop = fiveLoop + 1;
  }
  return(averagesOfFive);
}

function averageOfTwelvesOfArray(array) {
  var twelveArray = 0;
  var twelveLoop = 0;
  var averagesOfTwelve = [];
  while (twelveLoop < array.length - 11) {
    twelveArray = [Number(array[twelveLoop]), Number(array[twelveLoop + 1]), Number(array[twelveLoop + 2]), Number(array[twelveLoop + 3]), Number(array[twelveLoop + 4]), Number(array[twelveLoop + 5]), Number(array[twelveLoop + 6]), Number(array[twelveLoop + 7]), Number(array[twelveLoop + 8]), Number(array[twelveLoop + 9]), Number(array[twelveLoop + 10]), Number(array[twelveLoop + 11])];
    averagesOfTwelve.push(averageOfArray(twelveArray));
    twelveLoop = twelveLoop + 1;
  }
  return(averagesOfTwelve);
}

function addToTable(id, data) {
  var tr = document.createElement("tr");
  for (var i = 0; i < data.length; i++) {
      var td = document.createElement("td");
      td.appendChild(document.createTextNode(data[i].toString()));
      tr.appendChild(td);
  }
  document.getElementById(id).appendChild(tr);
}

function iPlus() {
  inspectionStartOn = inspectionStartOn + 1;
  document.getElementById("inspection").innerHTML = inspectionStartOn.toString();
  updateStorage();
}

function iMinus() {
  if (inspectionStartOn != 0) {
    inspectionStartOn = inspectionStartOn - 1;
    document.getElementById("inspection").innerHTML = inspectionStartOn.toString();
    updateStorage();
  }
}

function cLeft() {
  backgroundNum = backgroundNum - 1;
  if (backgroundNum === -1) {
    backgroundNum = 5;
  }
  backgroundChange();
  updateStorage();
}

function cRight() {
  backgroundNum = backgroundNum + 1;
  if (backgroundNum === 6) {
    backgroundNum = 0;
  }
  backgroundChange();
  updateStorage();
}

function backgroundChange() {
  backgroundRGB = backgroundRGBs[backgroundNum];
  backgroundName = backgroundNames[backgroundNum];
  document.getElementById("body").style = "background-image: linear-gradient( rgba(" + backgroundRGB + ", 0.75), rgba(" + backgroundRGB + ", 0.75) ), url('https://booligoosh.github.io/rubiks-time/beach.jpg');";
  document.getElementById("color").innerHTML = backgroundName;
}

function deleteSolve(index) {
  var r = confirm("You have chosen to delete solve " + Number(index + 1) + " - " + clockify(solves1[index]) + "\nAre you sure you want to delete it?");
  if (r == true) {
    solves1.splice(index, 1);
    updateStorage();
    solvesList();
  } else {
    
  }
}

function updateStorage() {
    if (typeof(Storage) !== "undefined") {
      localStorage.rubiksMultiInspectionStartOn = inspectionStartOn;
      localStorage.rubiksMultiBackgroundNum = backgroundNum;
      localStorage.rubiksMultiSolves1 = solves1.join();
      localStorage.rubiksMultiSolves2 = solves2.join();
      localStorage.rubiksMultiSolves3 = solves3.join();
      localStorage.rubiksMultiSolves4 = solves4.join();
    } else {
      document.cookie = "cookies= |" + inspectionStartOn + "|" + backgroundNum + "|" + solves1.join() + "|" + solves2.join() + "|" + solves3.join() + "|" + solves4.join();
    }
    
}

function newSolve() {
  startDown = false;
  startUp = false;
  inspectionStarted = false;
  solveStarted = false;
  playersDone = 0;
  player1done = false;
  player2done = false;
  player3done = false;
  player4done = false;
  document.getElementById("scramble").innerHTML = scramblers["333"].getRandomScramble().scramble_string;
}

//GOOGLE CHARTS SCRIPTS
      function drawChart() {
        var data = google.visualization.arrayToDataTable(chartArray);

        var options = {
          title: 'Solves over time',
          //curveType: 'function',
          legend: { position: 'bottom' }
        };

        var chart = new google.visualization.LineChart(document.getElementById('graph'));

        chart.draw(data, options);
      }
