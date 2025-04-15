
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

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
  index?: number;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, className, index = 0 }) => {
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

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const iconAnimation = {
    hover: {
      scale: 1.2,
      rotate: [0, 10, -10, 0],
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <Card className={`overflow-hidden h-full ${className}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{name}</CardTitle>
            <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
              <Badge className={`${getStatusColor(status)} capitalize`}>
                {status}
              </Badge>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="flex items-center space-x-1 text-muted-foreground mb-2">
            <motion.span 
              className="text-2xl mr-2"
              whileHover={iconAnimation.hover}
            >
              {getSportIcon(sportType)}
            </motion.span>
            <span className="capitalize">{sportType || 'Generic'}</span>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center">
              <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.5 }}>
                <Calendar className="h-4 w-4 mr-2" />
              </motion.div>
              <span>{date}</span>
            </div>
            
            <div className="flex items-center">
              <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 400 }}>
                <Users className="h-4 w-4 mr-2" />
              </motion.div>
              <span>{teamsCount} Times</span>
            </div>
            
            {status === 'completed' && winner && (
              <motion.div 
                className="flex items-center text-amber-500 dark:text-amber-400 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.div 
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "loop",
                    repeatDelay: 5
                  }}
                >
                  <Trophy className="h-4 w-4 mr-2" />
                </motion.div>
                <span>Winner: {winner}</span>
              </motion.div>
            )}
          </div>
        </CardContent>
        
        <CardFooter>
          <Link 
            to={`/tournament/${id}`} 
            className="w-full text-center py-2 bg-primary text-primary-foreground rounded-md flex items-center justify-center transition hover:bg-primary/90"
          >
            <span>View Tournament</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <ArrowRight className="h-4 w-4 ml-2" />
            </motion.div>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TournamentCard;
