import React from 'react';

const DisplayMap = ({mapToDisplay, clickable=false, setState=null, state=null}) => {

    if (clickable){
        return (
            <ul>
              {mapToDisplay.map((item, index) => (
                <li key={index} onClick={() => setState(item)} style={{
                    cursor: 'pointer',
                    color: state === item ? 'red' : 'black',
                  }}>
                  {Object.entries(item).map(([key, value]) => (
                    <div key={key}>
                      <strong>{key}:</strong> {value}<br />
                    </div>
                  ))}
                </li>
              ))}
            </ul>
          );
    }
  return (
    <ul>
      {mapToDisplay.map((item, index) => (
        <li key={index}>
          {Object.entries(item).map(([key, value]) => (
            <div key={key}>
              <strong>{key}:</strong> {value}<br />
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
};

export default DisplayMap;
