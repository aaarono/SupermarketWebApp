// TextOutput.js
import React from 'react';

const TextOutput = ({ products }) => {
  if (!products || products.length === 0) {
    return <div>Нет доступных продуктов.</div>;
  }

  return (
    <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
      {products.map((product, index) => (
        <li key={index} style={{ marginBottom: '8px' }}>
          {product}
        </li>
      ))}
    </ul>
  );
};

export default TextOutput;
