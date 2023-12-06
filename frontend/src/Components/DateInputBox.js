import React from 'react';
import DateConverter from './DateConverter';

const DateInputBox = ({setState, label, hasTime = false }) => {
  const handleChange = (event) => {
    setState(event.target.value);
    console.log(DateConverter(event.target.value, true))
  };
if (!hasTime){
  return (
    <div>
        <label htmlFor="dateInput">{label}</label>
        <input
            className='inputBox'
            type="date"
            // onChange={(e) => handleChange(e)}
            onChange = {handleChange}
            required
        />
      </div>
  );
}
else{
  return (
    <div>
        <label htmlFor="dateInput">{label}</label>
        <input
            className='inputBox'
            type="datetime-local"
            // onChange={(e) => handleChange(e)}
            onChange = {handleChange}
            required
        />
      </div>
  );
}
};

export default DateInputBox;