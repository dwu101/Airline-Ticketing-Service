
const DropdownGeneral = ({ items, setState, state, label }) => {
    const handleChange = (e) => {
      setState(e.target.value);
    };
  
    return (
      <div>
        <label>{label}</label>
        <select value={state} onChange={(e) => handleChange(e)}>
          <option value="">Select an option</option>
          {items.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    );
  };

export default DropdownGeneral