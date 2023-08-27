import React from 'react';

const Star = ({ selected, onSelect }) => (
  <span onClick={onSelect} style={{ cursor: 'pointer' }}>
    {selected ? '★' : '☆'}
  </span>
);

export default Star;
