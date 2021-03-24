import React from 'react';

export default function Checkbox({
  fields, setFields, title, ...props
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', marginLeft: 5,
    }}
    >
      <input
        type="checkbox"
        id="scales"
        name="scales"
        {...props}
      />
      <label style={{ marginLeft: 10 }} htmlFor="scales">{title}</label>
    </div>
  );
}
