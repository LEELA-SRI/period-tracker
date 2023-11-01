import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import './App.css'; // Import your CSS file

function App() {
  const [startDate, setStartDate] = useState(null);
  const [periodDates, setPeriodDates] = useState([]);
console.log(fetch(process.env.REACT_APP_URL_PREFIX));
  useEffect(() => {
    // Fetch the period start dates from the backend when the component first mounts
    const fetchPeriodDates = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_URL_PREFIX+'/get_date');
        // console.log(response);
        setPeriodDates(response.data.dates.map(date => new Date(date)));
        
        if (response.data.dates.length > 0) {
          setStartDate(new Date(response.data.dates[response.data.dates.length - 1]));
        } else {
          const userDate = prompt('Please enter your period start date (YYYY-MM-DD):');
          if (userDate) {
            const [year, month, day] = userDate.split('-').map(Number);
            // Set the time to 00:00:00
            const newStartDate = new Date(year, month - 1, day, 0, 0, 0);
            setStartDate(newStartDate);
            axios.post(process.env.REACT_APP_URL_PREFIX+'/update_date', { start_date: userDate });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchPeriodDates();
  }, []);
 
  const getTileClassName = ({ date, view }) => {
    // Convert both dates to yyyy-mm-dd format for comparison
    const dateStr = date.toISOString().slice(0, 10);
    const startDateStr = startDate.toISOString().slice(0, 10);

    // Calculate the difference in days between the current date and the start date
    const diffInDays = Math.floor((date - startDate) / (1000 * 60 * 60 * 24)) % 28;

    if (diffInDays >= 0 && diffInDays < 5) {
      // Menstrual phase (day 1-5)
      return 'menstrual-phase';
    } else if (diffInDays >= 7 && diffInDays < 17) {
      // Fertile phase (day 8-17)
      return 'fertile-phase';
    } else {
      // All other days
      return 'other-days';
    }
  };

  const handleDateChange = async (event) => {
    const newStartDateStr = event.target.value;
    const newStartDate = new Date(newStartDateStr);
    newStartDate.setHours(0,0,0,0);
    console.log(newStartDate,'start');
    setStartDate(newStartDate);
    setPeriodDates([...periodDates, newStartDate]);
    // Send a request to the backend whenever the start date is updated
    console.log('hi');
   
    const response = await axios.post(process.env.REACT_APP_URL_PREFIX+'/update_date', { start_date: newStartDateStr });
    console.log(response.data);
  };

  return (
    <div className="App">
      {startDate && (
        <>
          <label className={process.env.REACT_APP_URL_PREFIX}>
            Change Start Date:
            <input type="date" onChange={handleDateChange} />
          </label>
          <Calendar tileClassName={getTileClassName} />
        </>
      )}
    </div>
  );
}

export default App;








