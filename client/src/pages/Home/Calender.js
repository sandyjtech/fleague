import React, { useState } from "react";
import "./Calender.css";
import CancelIcon from "@mui/icons-material/Cancel";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";


const Calendar = ({ schedules }) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString("default", { month: "long" });
//console.log(schedules)
  // Get the number of days in the current month
  const lastDayOfMonth = new Date(
    year,
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Create an array of day names
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Create an array to represent the days of the month
  const daysOfMonth = Array.from(
    { length: lastDayOfMonth },
    (_, index) => index + 1
  );

  // Format event date function
  const formatEventDate = (eventDateStr) => {    
    const eventDate = new Date(eventDateStr);
    return eventDate.toString().substring(0, 15);
  };

  // State for the selected date and modal visibility
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle clicking on an event day
  const handleEventDayClick = (eventDate) => {
    setSelectedDate(eventDate);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Filter events for the selected date
  const eventsForSelectedDate = schedules.filter(
    (event) => event.date === selectedDate
    
  );
  console.log(schedules) 

  const formatEventTime = (eventTimeStr, timeZone) => {
    const eventTime = new Date(eventTimeStr);
    const options = {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZoneName: "short",
    };
    return eventTime.toLocaleTimeString(undefined, options) + ` (${timeZone})`;
  };
  return (
    <div className="calendar">
        <h3>Select <span style={{color: "green"}}>Game Day</span> to view scheduled games.</h3><br/>
      <div className="calendar-header">
        <span className="month">{month} </span>
        <span className="year">{year}</span>
      </div>
      <div className="calendar-body">
        {daysOfWeek.map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        {daysOfMonth.map((day) => {
          const eventsForDay = schedules.filter((event) => {
            return new Date(event.date).getDate() === day;
          });

          return (
            <div key={day} className="date-cell">
              {day}
              
              {eventsForDay.length > 0 && (
  <div
    className="event-date"
    onClick={() => handleEventDayClick(eventsForDay[0].date)}
  >
    Game Day
  </div>
  
)}
{/* {console.log(day, eventsForDay)} */}
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <Dialog open={isModalOpen} onClose={closeModal} maxWidth="md">
          <DialogTitle style={{fontFamily: 'Roboto Slab'}}>
            Games for {formatEventDate(selectedDate)}
            <button className="close-button" onClick={closeModal}>
              <CancelIcon />
            </button>
          </DialogTitle>
          <DialogContent>
            <ul>
              {eventsForSelectedDate.map((event, index) => (
                <li key={index}>
                  <div className="event-date">
                    {formatEventDate(event.date)}
                  </div>
                  <div className="event-details">
                    <div style={{ color: "#142e60", fontWeight: "bold" }}>
                      {event.title}
                    </div>
                    <div>{event.opponent}</div>
                    <div>
                      {formatEventTime(event.time, "Eastern Time (ET)")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Calendar;
