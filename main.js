/** @format */

//keep track of the displayed month//
let nav = 0;

let clicked = null;

let events = localStorage.getItem(`events`) ? JSON.parse(localStorage.getItem(`events`)) : [];

const calendar = document.getElementById('calendar');
const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

//array to determine the number of 'paddding days' required//
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function openModal(date) {
 clicked = date;

 const eventForDay = events.find((e) => e.date === clicked);

 if (eventForDay) {
  document.getElementById('eventText').innerText = eventForDay.title;
  deleteEventModal.style.display = 'block';
 } else {
  newEventModal.style.display = 'block';
 }
 backDrop.style.display = 'block';
}

//load function to display the calendar//
function load() {
 //get information about calendar to display it//
 const dt = new Date();

 //go back and forth between months//
 if (nav !== 0) {
  dt.setMonth(new Date().getMonth() + nav);
 }

 const day = dt.getDate();
 const month = dt.getMonth();
 const year = dt.getFullYear();

 //first date in the current month//
 const firstDayOfMonth = new Date(year, month, 1);

 //number of days in the given month//
 const daysInMonth = new Date(year, month + 1, 0).getDate();

 //creating a date string//
 const dateString = firstDayOfMonth.toLocaleDateString(`en-us`, {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
 });

 //number of padding days in the given month//
 const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

 //display month on top left//
 document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

 //set the calander data to blank//
 calendar.innerHTML = '';

 //loop through the padding days/ days in the month, wrap round in a square//
 for (let i = 1; i <= paddingDays + daysInMonth; i++) {
  const daySquare = document.createElement('div');
  daySquare.classList.add('day');

  const dayString = `${month + 1}/${i - paddingDays}/${year}`;

  //check to see if a padding day or a day should be rendered//
  if (i > paddingDays) {
   //render the date into the current square//
   daySquare.innerText = i - paddingDays;
   const eventForDay = events.find((e) => e.date === dayString);

   //show current day//
   if (i - paddingDays === day && nav === 0) {
    daySquare.id = 'currentDay';
   }
   if (eventForDay) {
    //put event inside dayString//
    const eventDiv = document.createElement('div');
    eventDiv.classList.add('event');
    eventDiv.innerText = eventForDay.title;
    daySquare.appendChild(eventDiv);
   }
   daySquare.addEventListener('click', () => openModal(dayString));
  } else {
   daySquare.classList.add('padding');
  }

  //add the date square into the calendar container//
  calendar.appendChild(daySquare);
 }
}

//function to close the modal//
function closeModal() {
 eventTitleInput.classList.remove('error');
 newEventModal.style.display = 'none';
 deleteEventModal.style.display = 'none';
 backDrop.style = 'none';
 eventTitleInput.value = '';
 clicked = null;
 load();
}

//function to save an event//
function saveEvent() {
 if (eventTitleInput.value) {
  eventTitleInput.classList.remove('error');
  events.push({
   date: clicked,
   title: eventTitleInput.value,
  });
  //store to local storage//
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
 } else {
  eventTitleInput.classList.add('error');
 }
}
function initButtons() {
 //next button//
 document.getElementById('nextButton').addEventListener('click', () => {
  nav++;
  load();
 });
 //back button//
 document.getElementById('backButton').addEventListener('click', () => {
  nav--;
  load();
 });

 //delete event function//
 function deleteEvent() {
  //filerting the Events array//
  events = events.filter((e) => e.date !== clicked);
  //reset in localStorage///
  localStorage.setItem('events', JSON.stringify(events));
  closeModal();
 }
 //save button//
 document.getElementById('saveButton').addEventListener('click', saveEvent);

 //cancel button//
 document.getElementById('cancelButton').addEventListener('click', closeModal);

 document.getElementById('deleteButton').addEventListener('click', deleteEvent);

 document.getElementById('closeButton').addEventListener('click', closeModal);
}
initButtons();
load();
