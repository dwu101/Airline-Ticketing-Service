const Star = ({ selected, onClick }) => (
    <span style={{ cursor: 'pointer', color: selected ? 'gold' : 'gray',fontSize: '30px' }} onClick={onClick}>
      &#9733;
    </span>
  );

export default Star;