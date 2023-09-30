// input placeholder changes and class changes

import React from "react";

const Input = ({
  label = "",
  name = "",
  type = "text",
  className = "",
  inputClassName = "",
  isRequired = true,
  placeholder = "",
  value = "",
  onChange = () => {},
}) => {
  return (
    <div className={` ${className}`}>
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-purple-950 "
      >
        {label}
      </label>

      <input
        type={type}
        className={`bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5  ${inputClassName}`}
        placeholder={placeholder}
        required={isRequired}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
