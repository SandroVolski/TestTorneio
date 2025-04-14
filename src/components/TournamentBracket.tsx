
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Lock, ChevronRight } from 'lucide-react';

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
  
  return (
    <div className="overflow-x-auto pb-6">
      <div className="flex space-x-8 p-4">
        {rounds.map(({ round, matches }) => (
          <div 
            key={round} 
            className="flex flex-col space-y-6"
            style={{ 
              width: getMatchWidth(round, rounds.length),
              marginTop: `${round > 1 ? 2 ** (round - 1) * 20 : 0}px`
            }}
          >
            <div className="text-center font-medium mb-2">
              {round === 1 
                ? 'Primeira Rodada' 
                : round === rounds.length 
                  ? 'Final' 
                  : round === rounds.length - 1 
                    ? 'Semifinal'
                    : `Rodada ${round}`}
            </div>
            
            {matches.map((match, index) => (
              <div 
                key={match.id} 
                className="relative"
                style={{ 
                  marginBottom: `${round > 1 ? 2 ** (round - 1) * 40 : 0}px` 
                }}
              >
                <Card 
                  className={`
                    cursor-pointer transition hover:shadow-md 
                    ${match.winner ? 'border-primary/30' : ''}
                  `}
                  onClick={() => onMatchClick && onMatchClick(match.id)}
                >
                  <CardContent className="p-3">
                    <div className="space-y-2">
                      <div className={`flex justify-between items-center ${match.winner === match.team1 ? 'font-bold text-primary' : ''}`}>
                        <span>{match.team1 || 'TBD'}</span>
                        <span>{match.score1}</span>
                      </div>
                      <div className={`flex justify-between items-center ${match.winner === match.team2 ? 'font-bold text-primary' : ''}`}>
                        <span>{match.team2 || 'TBD'}</span>
                        <span>{match.score2}</span>
                      </div>
                    </div>
                    
                    {match.winner && (
                      <div className="absolute -right-1 -top-1 h-5 w-5 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                        <Lock className="h-3 w-3" />
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Draw lines to next match if not final */}
                {match.nextMatchId && (
                  <div className="absolute right-0 top-1/2 h-0.5 w-10 bg-primary/30" />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TournamentBracket;
