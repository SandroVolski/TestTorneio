
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Tournament {
  id: string;
  name: string;
  sportType: string;
  date: string;
  teamsCount: number;
  status: 'upcoming' | 'active' | 'completed';
  winner?: string;
}

interface TournamentCardProps {
  tournament: Tournament;
  className?: string;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, className }) => {
  const { id, name, sportType, date, teamsCount, status, winner } = tournament;
  
  const getSportIcon = (type: string | undefined) => {
    // Add a safeguard against undefined type
    if (!type) return '🏆';
    
    switch (type.toLowerCase()) {
      case 'soccer':
      case 'football':
        return '⚽';
      case 'basketball':
        return '🏀';
      case 'volleyball':
        return '🏐';
      case 'handball':
        return '🤾';
      case 'cards':
      case 'truco':
      case 'canastra':
        return '🃏';
      default:
        return '🏆';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500';
      case 'active':
        return 'bg-emerald-500';
      case 'completed':
        return 'bg-amber-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <Card className={`overflow-hidden card-hover ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{name}</CardTitle>
          <Badge className={`${getStatusColor(status)} capitalize`}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center space-x-1 text-muted-foreground mb-2">
          <span className="text-2xl mr-2">{getSportIcon(sportType)}</span>
          <span className="capitalize">{sportType || 'Generic'}</span>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{date}</span>
          </div>
          
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            <span>{teamsCount} Teams</span>
          </div>
          
          {status === 'completed' && winner && (
            <div className="flex items-center text-amber-500 dark:text-amber-400 font-medium">
              <Trophy className="h-4 w-4 mr-2" />
              <span>Winner: {winner}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Link 
          to={`/tournament/${id}`} 
          className="w-full text-center py-2 bg-primary text-primary-foreground rounded-md flex items-center justify-center transition hover:bg-primary/90"
        >
          <span>View Tournament</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default TournamentCard;
