
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronRight, 
  Trophy, 
  Lock, 
  Flag,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MatchNode {
  id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  winner?: string;
  nextMatchId?: string;
  round: number;
  position: number;
}

interface TournamentBracketProps {
  matches: MatchNode[];
  onMatchClick?: (matchId: string) => void;
}

const TournamentBracket: React.FC<TournamentBracketProps> = ({ 
  matches,
  onMatchClick
}) => {
  const [activeMatch, setActiveMatch] = useState<string | null>(null);
  
  // Group matches by round
  const roundsMap = matches.reduce((acc, match) => {
    if (!acc[match.round]) {
      acc[match.round] = [];
    }
    acc[match.round].push(match);
    return acc;
  }, {} as Record<number, MatchNode[]>);
  
  // Sort rounds and matches within rounds
  const rounds = Object.keys(roundsMap)
    .map(Number)
    .sort((a, b) => a - b)
    .map(round => {
      return {
        round,
        matches: roundsMap[round].sort((a, b) => a.position - b.position)
      };
    });
  
  const getMatchWidth = (round: number, totalRounds: number) => {
    // Make earlier rounds narrower
    const baseWidth = 200;
    const factor = 1 + (round / totalRounds) * 0.5;
    return baseWidth * factor;
  };

  const getRoundName = (round: number, totalRounds: number) => {
    if (round === 1) return 'Primeira Rodada';
    if (round === totalRounds) return 'Final';
    if (round === totalRounds - 1) return 'Semifinal';
    if (round === totalRounds - 2) return 'Quartas de Final';
    if (round === totalRounds - 3) return 'Oitavas de Final';
    return `Rodada ${round}`;
  };

  const getTeamFlag = (team: string) => {
    // This is a placeholder function - in a real app, you would
    // map team names to actual country codes or images
    const flags: Record<string, string> = {
      'Brasil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Espanha': '🇪🇸',
      'França': '🇫🇷',
      'Alemanha': '🇩🇪',
      'Itália': '🇮🇹',
      'Portugal': '🇵🇹',
      'Inglaterra': '🇬🇧',
      'Holanda': '🇳🇱',
      'Bélgica': '🇧🇪',
      'Croácia': '🇭🇷',
      'Uruguai': '🇺🇾',
      'Colômbia': '🇨🇴',
      'Japão': '🇯🇵',
      'México': '🇲🇽',
      'Estados Unidos': '🇺🇸',
      'Canadá': '🇨🇦',
      'Coréia do Sul': '🇰🇷',
      'Austrália': '🇦🇺',
      'Senegal': '🇸🇳',
      'Marrocos': '🇲🇦',
      'Gana': '🇬🇭',
      'Camarões': '🇨🇲',
      'Suíça': '🇨🇭',
      'Dinamarca': '🇩🇰',
      'Polônia': '🇵🇱',
    };
    
    return flags[team] || '🏆';
  };
  
  return (
    <div className="overflow-x-auto overflow-y-hidden pb-6 pt-2">
      <motion.div 
        className="flex space-x-8 p-4 min-w-fit mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {rounds.map(({ round, matches }) => (
          <motion.div 
            key={round} 
            className="flex flex-col space-y-6"
            style={{ 
              width: getMatchWidth(round, rounds.length),
              marginTop: `${round > 1 ? 2 ** (round - 1) * 20 : 0}px`
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: round * 0.1 }}
          >
            <div className="text-center font-medium mb-2 bg-primary/10 py-1 px-2 rounded-md text-primary">
              {getRoundName(round, rounds.length)}
            </div>
            
            {matches.map((match, index) => (
              <motion.div 
                key={match.id} 
                className="relative"
                style={{ 
                  marginBottom: `${round > 1 ? 2 ** (round - 1) * 40 : 0}px` 
                }}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card 
                  className={`
                    cursor-pointer transition duration-200 
                    ${match.winner ? 'border-primary/30 bg-primary/5' : ''}
                    ${activeMatch === match.id ? 'ring-2 ring-primary' : ''}
                    hover:shadow-lg
                  `}
                  onClick={() => {
                    setActiveMatch(match.id);
                    onMatchClick && onMatchClick(match.id);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <motion.div 
                        className={`flex justify-between items-center ${match.winner === match.team1 ? 'font-bold text-primary' : ''}`}
                        animate={match.winner === match.team1 ? { 
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: '0.25rem',
                          paddingLeft: '0.5rem',
                          paddingRight: '0.5rem'
                        } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          {match.team1 && (
                            <span className="mr-2">{getTeamFlag(match.team1)}</span>
                          )}
                          <span>{match.team1 || 'TBD'}</span>
                        </div>
                        <span>{match.score1}</span>
                      </motion.div>
                      
                      <motion.div 
                        className={`flex justify-between items-center ${match.winner === match.team2 ? 'font-bold text-primary' : ''}`}
                        animate={match.winner === match.team2 ? { 
                          backgroundColor: 'rgba(16, 185, 129, 0.1)',
                          borderRadius: '0.25rem',
                          paddingLeft: '0.5rem',
                          paddingRight: '0.5rem'
                        } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center">
                          {match.team2 && (
                            <span className="mr-2">{getTeamFlag(match.team2)}</span>
                          )}
                          <span>{match.team2 || 'TBD'}</span>
                        </div>
                        <span>{match.score2}</span>
                      </motion.div>
                    </div>
                    
                    {match.winner && (
                      <motion.div 
                        className="absolute -right-1 -top-1 h-6 w-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                      >
                        <Lock className="h-3 w-3" />
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Draw lines to next match if not final */}
                {match.nextMatchId && (
                  <motion.div 
                    className="absolute right-0 top-1/2 h-0.5 bg-primary/30"
                    style={{ width: 100 }}
                    initial={{ width: 0 }}
                    animate={{ width: 100 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        ))}
      </motion.div>
      
      {/* Trophy in the middle for final match */}
      {rounds.length > 0 && (
        <motion.div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, duration: 0.5, type: "spring" }}
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <Trophy className="h-16 w-16 text-amber-500 drop-shadow-lg" />
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default TournamentBracket;
