// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth,onAuthStateChanged, signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js'
import { getDatabase, ref,push,child, get, set, onValue,remove } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDzmGLSbKdRAaKl-wyXuqFhyRqBgJclhFo",
authDomain: "s24-attendance-cal.firebaseapp.com",
projectId: "s24-attendance-cal",
storageBucket: "s24-attendance-cal.appspot.com",
messagingSenderId: "31870807749",
appId: "1:31870807749:web:10b26c7c83f7440f320aac",
databaseURL: "https://s24-attendance-cal-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
let uid = ""

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
  } else {
  }
});


const email = "praneethffs@gmail.com"

const addButton = document.getElementById("button")
const logButton = document.getElementById("button2")
const passButton = document.getElementById("pass-btn")


passButton.addEventListener("click", function(){
  const inmail = document.getElementById("emil").value;
  const inpass = document.getElementById("pass").value;
  console.log(inpass) 
  signInWithEmailAndPassword(auth, inmail, inpass)
  .then((userCredential) => { 
    const user = userCredential.user;
      console.log("Logged in!")
      document.getElementById("p-container").innerHTML = ``
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
    });
})

const yearSelect = document.getElementById("year");
const monthSelect = document.getElementById("month");
const daySelect = document.getElementById("day");
let recordedDay;

const months = ['January', 'February', 'March', 'April', 
'May', 'June', 'July', 'August', 'September', 'October',
'November', 'December'];

(function autofillmonths(){
  for(let i = 0; i < months.length; i++){
    const option = document.createElement('option');
    option.textContent = months[i];
    monthSelect.appendChild(option);
  }
})();


function autofilldays(month){
  //Delete all of the children of the day dropdown
  //if they do exist
  while(daySelect.firstChild){
    daySelect.removeChild(daySelect.firstChild);
  }
  //Holds the number of days in the month
  let numofdays;
  //Get the current year
  let year = yearSelect.value;
  
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
    //Insert the correct days into the day <select>
    for(let i = 1; i <= numofdays; i++){
      const option = document.createElement("option");
      option.textContent = i;
      daySelect.appendChild(option);
    }
    if(recordedDay){
      daySelect.value = recordedDay;
      if(daySelect.value === ""){
        daySelect.value = 1;
      }
    }
  }
  
  let year = new Date().getFullYear();
  //Make the previous 100 years be an option
  const option = document.createElement("option");
  option.textContent = year;
  yearSelect.appendChild(option);
  
  autofilldays(monthSelect.value);
  
  yearSelect.onchange = function() {
    autofilldays(monthSelect.value);
  }
  monthSelect.onchange = function() {
    autofilldays(monthSelect.value);
  }
  daySelect.onchange = function() {
    recordedDay = daySelect.value;
  }
  
  daySelect.value = new Date().getDate();
  let currmonth = new Date().getMonth();
  monthSelect.value = months[currmonth];
  
  
  const listOS = document.getElementById("list-os")
  const listDIP = document.getElementById("list-dip")
  const listDC = document.getElementById("list-dc")
  const listDM = document.getElementById("list-dm")
  const listDHD = document.getElementById("list-dhd")
  const listRF = document.getElementById("list-rf")
  const ccEl = document.getElementById("courses-count")
  const graphEl = document.getElementById("grapher")
  

let counts = [0, 0, 0, 0, 0, 0]
const courses = ["OS", "DIP", "DM", "DC", "DHD", "RF"]
const smcourses = ["os", "dip", "dm", "dc", "dhd", "rf"]

var dict = {}; 

function checkifCountable(){
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
    return "rgb(255,228,233)"
  } else if (num === 1){
    return "rgb(125,255,101)"
  } else if (num === 2){
    return "rgb(255,75,75)"
  }
}

listOS.addEventListener("click", function(){
  counts[0] += 1;
  counts[0] = counts[0]%3;
  listOS.style.backgroundColor = changeColor(counts[0])
  checkifCountable();
})

listDIP.addEventListener("click", function(){
  counts[1] += 1;
  counts[1] = counts[1]%3;
  listDIP.style.backgroundColor = changeColor(counts[1])
  checkifCountable();
})

listDM.addEventListener("click", function(){
  counts[2] += 1;
  counts[2] = counts[2]%3;
  listDM.style.backgroundColor = changeColor(counts[2])
  checkifCountable();
})

listDC.addEventListener("click", function(){
  counts[3] += 1;
  counts[3] = counts[3]%3;
  listDC.style.backgroundColor = changeColor(counts[3])
  checkifCountable();
})

listDHD.addEventListener("click", function(){
  counts[4] += 1;
  counts[4] = counts[4]%3;
  listDHD.style.backgroundColor = changeColor(counts[4])
  checkifCountable();
})

listRF.addEventListener("click", function(){
  counts[5] += 1;
  counts[5] = counts[5]%3;
  listRF.style.backgroundColor = changeColor(counts[5])
  checkifCountable();
})

const database = getDatabase(app)

function decodeDate(datelist){
  return `${datelist[0]} ${months[datelist[1]]}`
}

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
    get(ref(database, `${courses[i]}/stats`)).then((snapshot) => {
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
    get(ref(database, `${courses[course]}/${damo}`)).then((snapshot) => {
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

  markDays(Number(course), document.getElementById("mark-month").value);

  document.getElementById("mark-month").onchange = function(){
    markDays(Number(course), document.getElementById("mark-month").value)
  }

})

graphAttendance();


addButton.addEventListener("click", function(){
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

      get(ref(database, `${courses[i]}/${damo}`)).then((snapshot) => {
        if(snapshot.exists()){
          alert(`Attendance has already been logged for: ${courses[i]}`)
        }
        else{
          set(ref(database, `${courses[i]}/${damo}`), {
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
          
          get(ref(database, `${courses[i]}/stats`)).then((snapshot) => {
            if(snapshot.exists()){
              let obj = snapshot.val();
              objtotal = Number(obj.total);
              objattended = Number(obj.attended);
              numTotal += objtotal
              numAttended += objattended
              set(ref(database, `${courses[i]}/stats`), {
                total: numTotal,
                attended: numAttended
              })
            }
            else{
              set(ref(database, `${courses[i]}/stats`), {
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
    const listEle = document.getElementById(`list-${smcourses[i]}`);
    listEle.style.backgroundColor = changeColor(counts[i]);
  }

  alert(`Logging done.`);

  graphAttendance();
})

const password = "placeholderpass"


logButton.addEventListener("click", function(){
  graphAttendance();
})