import React from 'react';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-4">
      {/* <label htmlFor={label.toLowerCase()} className="block font-medium mb-1">
        {label}
      </label> */}
      <div className="relative">
        <select
          id={label.toLowerCase()}
          className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">{label}</option>
          {options.map(({ value, label }) => (
            <option key={value} value={value} className=''>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Dropdown;