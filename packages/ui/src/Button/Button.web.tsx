"use client";
import React from "react";
import { ButtonProps } from "./Button.types";

const getVariantClasses = (variant: ButtonProps['variant'] = 'primary') => {
  switch (variant) {
    case 'primary':
      return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
    case 'secondary':
      return 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500';
    case 'outline':
      return 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500';
    case 'ghost':
      return 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-blue-500';
    default:
      return 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500';
  }
};

const getSizeClasses = (size: ButtonProps['size'] = 'md') => {
  switch (size) {
    case 'sm':
      return 'px-3 py-2 text-sm';
    case 'md':
      return 'px-4 py-2 text-base';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2 text-base';
  }
};

export const Button = ({ 
  children, 
  onClick, 
  onPress, 
  disabled = false, 
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props 
}: ButtonProps) => {
  const handleClick = onClick || onPress;
  
  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-medium rounded-lg
        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${className}
      `.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
