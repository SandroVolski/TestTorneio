
import React, { useState } from 'react';
import { Check, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export interface MatchProps {
  id: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  status: 'scheduled' | 'in_progress' | 'completed';
  winner?: string;
  group?: string;
  round?: string;
  onMatchUpdate?: (matchId: string, data: any) => void;
}

const MatchCard: React.FC<MatchProps> = ({ 
  id, 
  team1, 
  team2, 
  score1, 
  score2, 
  status, 
  winner,
  group,
  round,
  onMatchUpdate
}) => {
  const { toast } = useToast();
  const [localScore1, setLocalScore1] = useState(score1);
  const [localScore2, setLocalScore2] = useState(score2);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleScoreChange = (team: 'team1' | 'team2', increment: boolean) => {
    if (team === 'team1') {
      setLocalScore1(prev => increment ? prev + 1 : Math.max(0, prev - 1));
    } else {
      setLocalScore2(prev => increment ? prev + 1 : Math.max(0, prev - 1));
    }
  };
  
  const saveMatch = () => {
    if (onMatchUpdate) {
      const winnerTeam = localScore1 > localScore2 
        ? team1 
        : localScore2 > localScore1 
          ? team2 
          : undefined;
      
      onMatchUpdate(id, {
        score1: localScore1,
        score2: localScore2,
        status: winnerTeam ? 'completed' : 'in_progress',
        winner: winnerTeam
      });
      
      if (winnerTeam) {
        toast({
          title: "Jogo Finalizado",
          description: `${winnerTeam} venceu a partida!`
        });
      }
    }
    
    setIsEditing(false);
  };
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-muted/30 p-3 flex justify-between items-center border-b">
          <div className="flex items-center space-x-2">
            {group && (
              <Badge variant="outline">Grupo {group}</Badge>
            )}
            {round && (
              <Badge variant="outline">{round}</Badge>
            )}
          </div>
          
          <Badge className={`
            ${status === 'scheduled' ? 'bg-blue-500' : 
              status === 'in_progress' ? 'bg-amber-500' : 
                status === 'completed' ? 'bg-emerald-500' : 'bg-muted'}
          `}>
            {status === 'scheduled' ? 'Agendado' : 
              status === 'in_progress' ? 'Em Andamento' : 
                status === 'completed' ? 'Finalizado' : status}
          </Badge>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <div className={`flex-1 font-medium text-left ${winner === team1 ? 'text-primary' : ''}`}>
              {team1} {winner === team1 && <Check className="inline h-4 w-4 text-primary" />}
            </div>
            <div className="px-4 text-xl font-bold">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleScoreChange('team1', false)}
                  >
                    -
                  </Button>
                  <span>{localScore1}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleScoreChange('team1', true)}
                  >
                    +
                  </Button>
                </div>
              ) : (
                localScore1
              )}
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <div className={`flex-1 font-medium text-left ${winner === team2 ? 'text-primary' : ''}`}>
              {team2} {winner === team2 && <Check className="inline h-4 w-4 text-primary" />}
            </div>
            <div className="px-4 text-xl font-bold">
              {isEditing ? (
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleScoreChange('team2', false)}
                  >
                    -
                  </Button>
                  <span>{localScore2}</span>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-8 w-8 rounded-full"
                    onClick={() => handleScoreChange('team2', true)}
                  >
                    +
                  </Button>
                </div>
              ) : (
                localScore2
              )}
            </div>
          </div>
        </div>
        
        {status !== 'completed' ? (
          <div className="p-3 bg-muted/20 border-t">
            {isEditing ? (
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={saveMatch}
                >
                  Salvar
                </Button>
              </div>
            ) : (
              <Button 
                className="w-full" 
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                {status === 'scheduled' ? 'Iniciar Partida' : 'Atualizar Placar'}
              </Button>
            )}
          </div>
        ) : (
          <div className="p-3 bg-muted/20 border-t flex items-center justify-center text-muted-foreground">
            <Lock className="h-4 w-4 mr-2" />
            <span>Jogo Finalizado</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MatchCard;
