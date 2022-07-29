//time
const newDate= new Date();
let dayOfWeek= newDate.getDay();
let month= newDate.getMonth()+1;
let dayOfMonth= newDate.getDate();
let year= newDate.getFullYear()
let hour=newDate.getHours();
let am_pm;
let min=newDate.getMinutes();
let sec=newDate.getSeconds();
switch (dayOfWeek){
  case(0):
    dayOfWeek="Sunday";
    break;
  case(1):
    dayOfWeek="Monday";
    break;
  case(2):
    dayOfWeek="Tuesday";
    break;
  case(3):
    dayOfWeek="Wednesday";
    break;
  case(4):
    dayOfWeek="Thursday";
    break;
  case(5):
    dayOfWeek="Friday";
    break;
  case(6):
    dayOfWeek="Saturday";
    break;
}
if (hour<=11){
  am_pm="AM";
}
else{
  am_pm="PM";
}
switch(hour){
  case(0):
    hour=12;
    break;
}
if(hour>12){
  hour -=12;
}
if (min<10){
  min="0"+min;
}
if (sec<10){
  sec="0"+sec;
}
document.getElementById("timeRefresh").onclick;
let completeDate= month+"/"+dayOfMonth+"/"+year+" - "+ hour+":"+min+":"+sec+" "+am_pm;
document.getElementById("time").innerHTML = completeDate;
document.getElementById("day").innerHTML = dayOfWeek;


//toDo
let textToDo;
document.getElementById("addToDo").onclick = function(){
    textToDo=document.getElementById("textToDo").value;
    var tag = document.createElement("li");
    var text = document.createTextNode(textToDo);
    tag.appendChild(text);
    var element = document.getElementById("toDoList");
    element.appendChild(tag);
}
let reset;
document.getElementById("resetToDo").onclick= function(){
    const removeDivElement = document.getElementById("toDoList");
    removeDivElement.remove();
    var divTag = document.createElement("div");
    var divText = document.createTextNode("");
    divTag.appendChild(divText);
    var divElement = document.getElementById("ul");
    divElement.appendChild(divTag);
    divTag.setAttribute('id','toDoList');
}
//calendar
let calendarDayOfWeek= newDate.getDay();
let calendarMonth= newDate.getMonth()+1;

switch (calendarDayOfWeek){
  case(0):
    calendarDayOfWeek="Sun";
    break;
  case(1):
    calendarDayOfWeek="Mon";
    break;
  case(2):
    calendarDayOfWeek="Tue";
    break;
  case(3):
    calendarDayOfWeek="Wed";
    break;
  case(4):
    calendarDayOfWeek="Thu";
    break;
  case(5):
    calendarDayOfWeek="Fri";
    break;
  case(6):
    calendarDayOfWeek="Sat";
    break;
}
switch (calendarMonth){
  case(1):
    calendarMonth="January";
    break;
  case(2):
    calendarMonth="February";
    break;
  case(3):
    calendarMonth="March";
    break;
  case(4):
    calendarMonth="April";
    break;
  case(5):
    calendarMonth="May";
    break;
  case(6):
    calendarMonth="June";
    break;
  case(7):
    calendarMonth="July";
    break;
  case(8):
    calendarMonth="August";
    break;
  case(9):
    calendarMonth="September";
    break;
  case(10):
    calendarMonth="October";
    break;
  case(11):
    calendarMonth="November";
    break;
  case(12):
    calendarMonth="December";
    break;
}
document.getElementById("calendarMonth").innerHTML= calendarMonth;
document.getElementById("calendarDate").innerHTML= calendarDayOfWeek+" " +dayOfMonth;

