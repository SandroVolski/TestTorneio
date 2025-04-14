
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Trophy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

const MatchView = () => {
  const { tournamentId, matchId } = useParams<{ tournamentId: string; matchId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tournament, setTournament] = useState<any>(null);
  const [match, setMatch] = useState<any>(null);
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  
  // Load tournament and match data
  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const foundTournament = tournaments.find((t: any) => t.id === tournamentId);
    
    if (foundTournament) {
      setTournament(foundTournament);
      
      const foundMatch = foundTournament.matches?.find((m: any) => m.id === matchId);
      if (foundMatch) {
        setMatch(foundMatch);
        setScore1(foundMatch.score1);
        setScore2(foundMatch.score2);
      } else {
        navigate(`/tournament/${tournamentId}`);
        toast({
          title: "Erro",
          description: "Partida não encontrada",
          variant: "destructive"
        });
      }
    } else {
      navigate('/');
      toast({
        title: "Erro",
        description: "Torneio não encontrado",
        variant: "destructive"
      });
    }
  }, [tournamentId, matchId, navigate, toast]);
  
  const updateScore = (team: 'team1' | 'team2', increment: boolean) => {
    if (match.status === 'completed') return;
    
    if (team === 'team1') {
      setScore1(prev => increment ? prev + 1 : Math.max(0, prev - 1));
    } else {
      setScore2(prev => increment ? prev + 1 : Math.max(0, prev - 1));
    }
  };
  
  const saveMatch = () => {
    // Determine winner
    const winner = score1 > score2 ? match.team1 : score2 > score1 ? match.team2 : undefined;
    
    // Update match
    const updatedMatch = {
      ...match,
      score1,
      score2,
      status: winner ? 'completed' : 'in_progress',
      winner
    };
    
    // Update tournament
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const tournamentIndex = tournaments.findIndex((t: any) => t.id === tournamentId);
    
    if (tournamentIndex !== -1) {
      const updatedMatches = tournaments[tournamentIndex].matches.map((m: any) => 
        m.id === matchId ? updatedMatch : m
      );
      
      tournaments[tournamentIndex].matches = updatedMatches;
      localStorage.setItem('tournaments', JSON.stringify(tournaments));
      
      toast({
        title: winner ? "Partida Finalizada" : "Placar Atualizado",
        description: winner ? `${winner} venceu a partida!` : "O placar foi atualizado com sucesso."
      });
      
      // Redirect back to tournament
      navigate(`/tournament/${tournamentId}`);
    }
  };
  
  if (!tournament || !match) {
    return <div className="container py-8">Carregando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex items-center py-4">
          <Link to={`/tournament/${tournamentId}`}>
            <Button variant="ghost" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar
            </Button>
          </Link>
          
          <div>
            <h1 className="text-xl font-bold">Gerenciar Partida</h1>
            <p className="text-sm text-muted-foreground">{tournament.name}</p>
          </div>
        </div>
      </header>
      
      <main className="container py-6">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Atualizar Placar</CardTitle>
              
              <Badge 
                className={`
                  ${match.status === 'scheduled' ? 'bg-blue-500' : 
                    match.status === 'in_progress' ? 'bg-amber-500' : 
                      match.status === 'completed' ? 'bg-emerald-500' : ''}
                `}
              >
                {match.status === 'scheduled' ? 'Agendado' : 
                  match.status === 'in_progress' ? 'Em Andamento' : 
                    match.status === 'completed' ? 'Finalizado' : match.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-6 py-4">
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg">{match.team1}</div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-10 w-10"
                      onClick={() => updateScore('team1', false)}
                      disabled={match.status === 'completed' || score1 <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-3xl font-bold w-10 text-center">{score1}</div>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-10 w-10"
                      onClick={() => updateScore('team1', true)}
                      disabled={match.status === 'completed'}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="text-center text-muted-foreground">VS</div>
                
                <div className="flex items-center justify-between">
                  <div className="font-medium text-lg">{match.team2}</div>
                  
                  <div className="flex items-center gap-3">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-10 w-10"
                      onClick={() => updateScore('team2', false)}
                      disabled={match.status === 'completed' || score2 <= 0}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    
                    <div className="text-3xl font-bold w-10 text-center">{score2}</div>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="rounded-full h-10 w-10"
                      onClick={() => updateScore('team2', true)}
                      disabled={match.status === 'completed'}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {match.status !== 'completed' ? (
                <Button 
                  className="w-full mt-6" 
                  onClick={saveMatch}
                >
                  {score1 !== match.score1 || score2 !== match.score2 ? 'Salvar Placar' : 'Sem Alterações'}
                </Button>
              ) : (
                <div className="flex justify-center items-center p-3 mt-6 bg-primary/10 rounded-lg text-primary gap-2">
                  <Trophy className="h-5 w-5" />
                  <span className="font-medium">Vencedor: {match.winner}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MatchView;
