import React from 'react';

type ButtonVariant = 'tambah' | 'edit' | 'hapus';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
  children: React.ReactNode;
}

const getButtonStyle = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'tambah':
      return 'bg-blue-500 hover:bg-blue-600 text-white';
    case 'edit':
      return 'bg-yellow-400 hover:bg-yellow-500 text-white';
    case 'hapus':
      return 'bg-red-500 hover:bg-red-600 text-white';
    default:
      return '';
  }
};

const Button: React.FC<ButtonProps> = ({ variant, children, ...props }) => {
  const buttonStyle = getButtonStyle(variant);

  return (
    <button
      {...props}
      className={`px-4 py-2 rounded-lg font-semibold ${buttonStyle} ${props.className || ''}`}
    >
      {children}
    </button>
  );
};

export default Button;