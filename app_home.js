import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth,onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { getDatabase, ref,push,child, get, set,remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyD4L1tqUZp22ZTtrnWTMBig4VlhtttgyRY",
    authDomain: "attencal-planner.firebaseapp.com",
    projectId: "attencal-planner",
    storageBucket: "attencal-planner.appspot.com",
    messagingSenderId: "794458371715",
    appId: "1:794458371715:web:1cee2cdd0f3f25b5d20db6",
    databaseURL: "https://attencal-planner-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getDatabase(app);
const userCredential = JSON.parse(sessionStorage.getItem('user-credentials'));
const userStr = `users/${userCredential.user.uid}/`
const taskColors = ["rgb(231, 206, 255)", "rgb(194, 130, 255)"];

document.getElementById("welcome-txt").innerHTML += "Welcome, "
get(ref(database, `users/${userCredential.user.uid}/name`)).then((snapshot) =>{
  document.getElementById("welcome-txt").innerHTML += (snapshot.val().split(' ')[0]);
})

const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
let recordedDay;
const yearSelect1 = document.getElementById("year1");
const monthSelect1 = document.getElementById("month1");
const daySelect1 = document.getElementById("day1");
let recordedDay1;
const clickedTasks = new Set()

const months = ['January', 'February', 'March', 'April', 
'May', 'June', 'July', 'August', 'September', 'October',
'November', 'December'];

function autofillmonths(mselect){
  for(let i = 0; i < months.length; i++){
    const option = document.createElement('option');
    option.textContent = months[i];
    mselect.appendChild(option);
  }
}

autofillmonths(monthSelect);
autofillmonths(monthSelect1);


function autofilldays(month, dselect, yselect, rday){

  while(dselect.firstChild){
    dselect.removeChild(dselect.firstChild);
  }
  let year = yselect.value;
  let numofdays;
  
  if(month === 'January' || month === 'March' || 
  month === 'May' || month === 'July' || month === 'August' 
  || month === 'October' || month === 'December') {
    numofdays = 31;
  } else if(month === 'April' || month === 'June' 
  || month === 'September' || month === 'November') {
    numofdays = 30;
  }else{
    //Check for a leap year
    if(new Date(year, 1, 29).getMonth() === 1){
      numofdays = 29;
    }else{
      numofdays = 28;
    }
    }
    for(let i = 1; i <= numofdays; i++){
      const option = document.createElement("option");
      option.textContent = i;
      dselect.appendChild(option);
    }
    if(rday){
      dselect.value = rday;
      if(dselect.value === ""){
        dselect.value = 1;
      }
    }
  }

/////////////////////////////////////////////////////////
let jahr = new Date().getFullYear();
const option = document.createElement("option");
option.textContent = jahr;
yearSelect.appendChild(option);

autofilldays(monthSelect.value, daySelect, yearSelect, recordedDay);

yearSelect.onchange = function() {
  autofilldays(monthSelect.value, daySelect, yearSelect, recordedDay);
}
monthSelect.onchange = function() {
  autofilldays(monthSelect.value, daySelect, yearSelect, recordedDay);
}
daySelect.onchange = function() {
  recordedDay = daySelect.value;
}
daySelect.value = new Date().getDate();
let currmonth = new Date().getMonth();
monthSelect.value = months[currmonth];
/////////////////////////////////////////////////////////
const option1 = document.createElement("option");
option1.textContent = jahr;
yearSelect1.appendChild(option1);
autofilldays(monthSelect1.value, daySelect1, yearSelect1, recordedDay1);

yearSelect1.onchange = function() {
  autofilldays(monthSelect1.value, daySelect1, yearSelect1, recordedDay1);
}
monthSelect1.onchange = function() {
  autofilldays(monthSelect1.value, daySelect1, yearSelect1, recordedDay1);
}
daySelect1.onchange = function() {
  recordedDay1 = daySelect1.value;
}
daySelect1.value = new Date().getDate();
let currmonth1 = new Date().getMonth();
monthSelect1.value = months[currmonth1];
/////////////////////////////////////////////////////////

const courses = JSON.parse(sessionStorage.getItem("courses"));
console.log(courses);
let counts = []

function checkifCountable(){
  const ccEl = document.getElementById("courses-count");
  ccEl.innerHTML = "";
  
  for(let i = 0; i < counts.length; i++){
    let counti = counts[i];
    if(counti > 0){
      ccEl.innerHTML += `<div class="cc-cont">
      <label for="num${courses[i]}"> ${courses[i]} </label>
      <input type="number" id="num${courses[i]}" placeholder="Number of classes" inputmode="numeric" min="1" max="5">
      </div>
      `
    }
  }
  for(let i = 0; i < counts.length; i++){
    let counti = counts[i];
    if(counti > 0){
      document.getElementById(`num${courses[i]}`).value = 1
    }
  }
}

function changeColor(num){
  if(num === 0){
    return "rgb(231, 206, 255)"
  } else if (num === 1){
    return "rgb(125,255,101)"
  } else if (num === 2){
    return "rgb(255,75,75)"
  }
}

for (let i = 0; i < courses.length; i++) {
    document.getElementById("courses-list").innerHTML += `<li id="list-${courses[i]}">${courses[i]}</li>`;
    counts.push(0);
}

for(let i = 0; i < courses.length; i++){
  document.getElementById(`list-${courses[i]}`).addEventListener('click', function(){
    counts[i] += 1;
    counts[i] = counts[i]%3;
    document.getElementById(`list-${courses[i]}`).style.backgroundColor = changeColor(counts[i])
    checkifCountable();
  })
}

const dict = {}
const graphEl = document.getElementById("grapher");
graphAttendance();
loadTasks();

const attref = ref(database, `users/${userCredential.user.uid}/attendance/`)

document.getElementById("add-button").addEventListener("click", function(){
  let indMonth = 0;
  for(indMonth; indMonth < 12; indMonth++){
    if(months[indMonth] == monthSelect.value){
      break;
    }
  }
  let indDay = daySelect.value
  let damo = "" + indDay + "-" + indMonth;


  for(let i = 0; i < counts.length; i++){
    if(counts[i] > 0){
      let numcls = Number(document.getElementById(`num${courses[i]}`).value);
                
      let pres = 0;
      if(counts[i] === 1){
        pres = numcls;
      }

      get(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/${damo}`)).then((snapshot) => {
        if(snapshot.exists()){
          alert(`Attendance has already been logged for: ${courses[i]}`)
        }
        else{
          set(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/${damo}`), {
            classes: Number(numcls),
            present: Number(pres)
          }).then(success => {
            console.log('Success');
          },
          error => {
            console.log('Error');
          }
          )
          console.log(`${courses[i]}: ${numcls}`);
          
          let numTotal = numcls;
          let numAttended = pres;
          let objattended = 0;
          let objtotal = 0;
          
          get(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/stats`)).then((snapshot) => {
            if(snapshot.exists()){
              let obj = snapshot.val();
              objtotal = Number(obj.total);
              objattended = Number(obj.attended);
              numTotal += objtotal
              numAttended += objattended
              set(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/stats`), {
                total: numTotal,
                attended: numAttended
              })
            }
            else{
              set(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/stats`), {
                total: numTotal,
                attended: numAttended
              })
            }
          }) 
        }
      })
    }
  }

  for(let i = 0; i < counts.length; i++){
    counts[i] = 0;
    const listEle = document.getElementById(`list-${courses[i]}`);
    listEle.style.backgroundColor = changeColor(counts[i]);
  }
  document.getElementById("courses-count").innerHTML = ""
  alert(`Logging done.`);
  graphAttendance();
})

document.getElementById("taskadd-button").addEventListener("click", function(){
  let indMonth = 0;
  for(indMonth; indMonth < 12; indMonth++){
    if(months[indMonth] == monthSelect.value){
      break;
    }
  }
  let indDay = daySelect.value
  let damo = "" + indDay + "-" + indMonth;
  const taskValue = document.getElementById("task-in").value
  if(taskValue == ""){
    return;
  }
  push(ref(database, userStr + `tasks/${damo}/`), taskValue);

  document.getElementById("task-in").value = ""
  alert(`Task/Note added.`);
})

const clickedornot = new Object();
function loadTasks(){
  document.getElementById("taskDisp-cont").innerHTML = ""
  let indMonth = 0;
  for(indMonth; indMonth < 12; indMonth++){
    if(months[indMonth] == monthSelect1.value){
      break;
    }
  }
  let indDay = daySelect1.value
  let damo = "" + indDay + "-" + indMonth;
  get(ref(database, userStr + `tasks/${damo}/`)).then((s) => {
    if(s.exists){
      const tasksList = s.val();
      for(var key in tasksList){
        document.getElementById("taskDisp-cont").innerHTML +=
        `
        <li class="taskDisp-item" id="${key}">${tasksList[key]}</li>
        `
        clickedornot[key] = false;
      }
    }
  })
}

document.getElementById("taskref-button").addEventListener('click', function(){
  loadTasks();
})

const taskClicks = {}
daySelect1.onchange = function(){
  loadTasks();
}

document.getElementById("delete-button").addEventListener("click", function(){
  let indMonth = 0;
  for(indMonth; indMonth < 12; indMonth++){
    if(months[indMonth] == monthSelect.value){
      break;
    }
  }
  let indDay = daySelect.value
  let damo = "" + indDay + "-" + indMonth;

  if(!confirm(`Are you sure you wanted to delete the attedance of selected courses for ${daySelect.value}, ${monthSelect.value}`)){
    alert(`Deletion cancelled.`)
    return;
  }
  for(let i = 0; i < counts.length; i++){
      const delRef = ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/${damo}`);
      get(delRef).then((s) => {
        if(!s.exists()){
          return;
        }
      })
      
      get(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/${damo}`)).then((snapshot) => {
        if(snapshot.exists()){
          let damoClasses = (snapshot.val().classes);
          let damoPresent = (snapshot.val().present);
          get(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/stats`)).then((snapshot) => {
            if(snapshot.exists()){
              let obj = snapshot.val();
              let objtotal = Number(obj.total);
              let objattended = Number(obj.attended);

              objtotal = obj.total - damoClasses;
              objattended -= damoPresent;
              set(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/stats`), {
                total: objtotal,
                attended: objattended
              })
            }
            else{
              set(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/stats`), {
                total: objtotal,
                attended: objattended
              })
            }
          })
          remove(delRef);
        }
      })
    }
    
    for(let i = 0; i < counts.length; i++){
      counts[i] = 0;
      const listEle = document.getElementById(`list-${courses[i]}`);
      listEle.style.backgroundColor = changeColor(counts[i]);
    }
    document.getElementById("courses-count").innerHTML = "";
    alert(`Attendance deleted for selected courses on the specified date.`);
  })

function graphAttendance(){
graphEl.innerHTML = ""
for(let i = 0; i < courses.length; i++){
  graphEl.innerHTML += `
  <div class="contoftwo" id="gc${courses[i]}">
  <div class="graphtitle"}>${courses[i]}</div>
  <div class="graph-ele" id="ge${courses[i]}">
  <div class="graph-ratio" id="gr${courses[i]}"></div>    
  <div class="graph-fill" id="g${courses[i]}"></div>
  </div>
  <div class="graphstat" id="stat${courses[i]}"}></div>
  </div>
  `
  dict[`gc${courses[i]}`] = i;
}

for(let i = 0; i < courses.length; i++){
  get(ref(database, `users/${userCredential.user.uid}/attendance/${courses[i]}/stats`)).then((snapshot) => {
    if(snapshot.exists()){
      let obj = snapshot.val();
      let pres = 0;
      let total = 0;
      pres = obj.attended;
      total = obj.total;
      if(total != 0){
        document.getElementById(`g${courses[i]}`).style.width = `${(pres/total)*200}px`;
        document.getElementById(`stat${courses[i]}`).innerHTML = `${Math.round((pres/total)*100*10)/10}%`
        document.getElementById(`gr${courses[i]}`).innerHTML = `${pres}/${total}`
      }
      else{
        document.getElementById(`g${courses[i]}`).style.width = "200px";
      }
    }
    else{
      document.getElementById(`g${courses[i]}`).style.width = "200px";
    }
  }
  )
}

}

function markDays(course, month){
  document.getElementById("mark-days").innerHTML = ""
  let damo = ""
  let m = 0;
  let year = new Date().getFullYear();

  for(m; m < months.length; m++){
    if(months[m] === month){
      break;
    }
  }

  for(let d = 1; d <= 31; d++){
    damo = d + "-" + m;
    get(ref(database, `users/${userCredential.user.uid}/attendance/${courses[course]}/${damo}`)).then((snapshot) => {
      if(snapshot.exists()){
        let obj = snapshot.val();
        let num = obj.classes;
        let pres = obj.present;

        if(pres > 0){
          document.getElementById("mark-days").innerHTML += `<div class="mark-cell pres-cell">${d}</div>`
        }
        else{
          document.getElementById("mark-days").innerHTML += `<div class="mark-cell abs-cell">${d}</div>`
        }
      }
    })
  }
}

graphEl.addEventListener('click', e => {
  let target = e.target.parentElement;
  if(target.className === "graph-ele"){
    target = target.parentElement;
  }
  const course = dict[target.id];

  document.getElementById("expanded").innerHTML = `<div class="det-view" id="det-id"></div>`
  document.getElementById("det-id").innerHTML = `
  <div class="marked-cal" id="cal-id">
    <select id="mark-month"></select>
    <div id="mark-days"></div>
  </div>
  `
  for(let i = 0; i < months.length; i++){
    const option = document.createElement('option');
    option.textContent = months[i];
    document.getElementById("mark-month").appendChild(option);
  }

  document.getElementById("mark-month").value = months[new Date().getMonth()];

  markDays(Number(course), document.getElementById("mark-month").value);

  document.getElementById("mark-month").onchange = function(){
    markDays(Number(course), document.getElementById("mark-month").value)
  }
})

document.getElementById("taskDisp-cont").addEventListener('click', e => {
  let targetId = e.target.id;
  clickedornot[targetId] = !clickedornot[targetId];
  if(targetId != "taskDisp-cont"){
    if(clickedornot[targetId]){
      document.getElementById(targetId).style.backgroundColor = taskColors[1];
      clickedTasks.add(targetId);
    }
    else{
      document.getElementById(targetId).style.backgroundColor = taskColors[0];
      clickedTasks.delete(targetId);
    }
  }
})

document.getElementById("taskdel-button").addEventListener('click', function(){
  let indMonth = 0;
  for(indMonth; indMonth < 12; indMonth++){
    if(months[indMonth] == monthSelect1.value){
      break;
    }
  }
  let indDay = daySelect1.value
  let damo = "" + indDay + "-" + indMonth;
  const listofClicked = Array.from(clickedTasks);
  for(let i  = 0; i < listofClicked.length; i++){
    const delRef = ref(database, `users/${userCredential.user.uid}/tasks/${damo}/${listofClicked[i]}`);
    remove(delRef);
    clickedTasks.delete(listofClicked[i]);
  }
  loadTasks();
})

document.getElementById("stats-button").addEventListener('click', function(){
  graphAttendance();
})