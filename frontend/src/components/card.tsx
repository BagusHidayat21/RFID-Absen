// AttendanceCard.tsx
import React, { ReactNode } from 'react';

// Define types for props
type CardType = 'present' | 'leave' | 'sick' | 'absent';

interface AttendanceCardProps {
  type: CardType;
  title: string;
  count: string;
  icon: ReactNode;
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({ type, title, count, icon }) => {
  // Card style variants based on type
  const cardStyles = {
    present: {
      card: 'bg-pink-50',
      icon: 'bg-pink-400 text-white'
    },
    leave: {
      card: 'bg-amber-50',
      icon: 'bg-amber-300 text-white'
    },
    sick: {
      card: 'bg-green-50',
      icon: 'bg-green-400 text-white'
    },
    absent: {
      card: 'bg-purple-50',
      icon: 'bg-purple-300 text-white'
    }
  };

  // Use type assertion to ensure TypeScript knows the type is valid
  const style = cardStyles[type] || cardStyles.present;

  return (
    <div className={`p-6 rounded-xl ${style.card} hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer hover:shadow-md`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${style.icon}`}>
        {icon}
      </div>
      <div className="text-lg font-semibold text-gray-800 mb-1">{title}</div>
      <div className="text-sm text-gray-600">{count}</div>
    </div>
  );
};

export default AttendanceCard;