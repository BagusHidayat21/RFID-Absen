import { JurusanProps } from '@/types';

const Jurusan: React.FC<JurusanProps> = ({ type, title, count, rombel, icon, onClick }) => {
  const cardStyles = {
    n1: { card: 'bg-pink-50', icon: 'bg-pink-400 text-white' },
    n2: { card: 'bg-amber-50', icon: 'bg-amber-300 text-white' },
    n3: { card: 'bg-green-50', icon: 'bg-green-400 text-white' },
    n4: { card: 'bg-purple-50', icon: 'bg-purple-300 text-white' }
  };

  const style = cardStyles[type] || cardStyles.n1;

  return (
    <div 
      className={`p-6 rounded-xl ${style.card} hover:translate-y-[-4px] transition-transform duration-200 cursor-pointer hover:shadow-md`}
      onClick={onClick} // Tangkap event klik
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${style.icon}`}>
        {icon}
      </div>
      <div className="text-lg font-semibold text-gray-800 mb-1">{title}</div>
      <div className="text-sm text-gray-600">{rombel}</div>
      <div className="text-sm text-gray-600">{count}</div>
    </div>
  );
};

export default Jurusan;