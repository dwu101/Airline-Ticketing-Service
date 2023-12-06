import React from "react";


// const Dropdown = ({items, setState, label}) => {
//     const handleChange = (e) => {
//         setState(e.target.value);
//     }

// return (
//     <div >
//         <label>{label}</label>
//         <select value={items} onChange={(e) => handleChange()}>
//           <option value="">Select an option</option>
//             {items.map(item => (
//           <option key={item.Airport_Name || item.City} value={item.Airport_Name || item.City}>
//             {item.Airport_Name || item.City}
//           </option>
//           ))}
//         </select>
//     </div>
// )
// }

// export default Dropdown;

const DropdownFlights = ({ items, setState, state, label }) => {
    const handleChange = (e) => {
        setState(e.target.value);
      };
    
      return (
        <div>
          <label>{label}</label>
          <select value={state} onChange={(e) => handleChange(e)}>
            <option value="">Select an option</option>
            {items.map((item) => (
              <option
                key={item.Airport_Name || item.City}
                value={item.Airport_Name || item.City}
              >
                {item.Airport_Name || item.City}
              </option>
            ))}
          </select>
        </div>
      );
    };
      
  
  export default DropdownFlights;