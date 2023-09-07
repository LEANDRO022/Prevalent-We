import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

function CalendarPicker() {
  const [date, setDate] = useState(new Date());

  const handleDateChange = newDate => {
    setDate(newDate);
  };

  return (
    <div>
      <Calendar
        onChange={handleDateChange}
        value={date}
        locale='en-US'
        className='calendar'
      />
    </div>
  );
}

export default CalendarPicker;
