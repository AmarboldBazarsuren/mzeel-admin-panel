// admin-panel/src/components/common/Table.js

import React from 'react';
import './Table.css';

export default function Table({ columns, data, onRowClick }) {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <p>Мэдээлэл байхгүй байна</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th 
                key={index} 
                style={{ width: column.width || 'auto' }}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr 
              key={rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'clickable' : ''}
            >
              {columns.map((column, colIndex) => (
                <td key={colIndex}>
                  {column.render 
                    ? column.render(row) 
                    : row[column.field]
                  }
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}