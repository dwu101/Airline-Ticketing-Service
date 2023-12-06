import React from 'react';

const TextInputBox = ({setState, label, requiredInput = true }) => {
  const handleChange = (event) => {
    setState(event.target.value);
  };

  return (
    <div className='SearchBox'>
        <label>{label}</label>
        <input
        type="text"
        onChange={handleChange}
        required = {requiredInput}
        />
    </div>
  );
};

export default TextInputBox;