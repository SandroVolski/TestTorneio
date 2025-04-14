
import React from 'react';
import { 
  Ball, 
  Dumbbell, 
  CircleDot, 
  Dice5, 
  BadmintonIcon 
} from 'lucide-react';

type Sport = {
  id: string;
  name: string;
  icon: React.ReactNode;
  isPremium?: boolean;
};

interface SportSelectorProps {
  selectedSport: string;
  onSelectSport: (sportId: string) => void;
}

const SportSelector: React.FC<SportSelectorProps> = ({ 
  selectedSport, 
  onSelectSport 
}) => {
  const sports: Sport[] = [
    { id: 'football', name: 'Futebol', icon: <Ball className="h-8 w-8" /> },
    { id: 'basketball', name: 'Basquete', icon: <CircleDot className="h-8 w-8" /> },
    { id: 'volleyball', name: 'Vôlei', icon: <CircleDot className="h-8 w-8" /> },
    { id: 'handball', name: 'Handebol', icon: <BadmintonIcon className="h-8 w-8" /> },
    { id: 'truco', name: 'Truco', icon: <Dice5 className="h-8 w-8" /> },
    { id: 'canastra', name: 'Canastra', icon: <Dice5 className="h-8 w-8" /> },
    { 
      id: 'pingpong', 
      name: 'Ping Pong', 
      icon: <CircleDot className="h-8 w-8" />,
      isPremium: true 
    },
    { 
      id: 'swimming', 
      name: 'Natação', 
      icon: <Dumbbell className="h-8 w-8" />,
      isPremium: true 
    },
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-3">Selecione a Modalidade</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {sports.map((sport) => (
          <div
            key={sport.id}
            className={`
              relative p-4 rounded-lg border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center
              ${selectedSport === sport.id 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50 hover:bg-primary/5'}
            `}
            onClick={() => onSelectSport(sport.id)}
          >
            <div className="text-primary mb-2">
              {sport.icon}
            </div>
            <span className="text-sm font-medium">{sport.name}</span>
            
            {sport.isPremium && (
              <span className="absolute top-1 right-1 bg-amber-500 text-xs rounded-full px-1 py-0.5 text-white">
                Premium
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SportSelector;
