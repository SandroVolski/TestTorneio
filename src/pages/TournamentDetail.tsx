
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Users, 
  Trophy, 
  Edit, 
  List, 
  BarChart3,
  Music
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import MatchCard from '@/components/MatchCard';
import TournamentBracket from '@/components/TournamentBracket';

const TournamentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [tournament, setTournament] = useState<any>(null);
  const [teams, setTeams] = useState<string[]>([]);
  const [newTeam, setNewTeam] = useState('');
  const [matches, setMatches] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('teams');
  const [showVictoryMusic, setShowVictoryMusic] = useState(false);
  
  // Load tournament data
  useEffect(() => {
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const found = tournaments.find((t: any) => t.id === id);
    
    if (found) {
      setTournament(found);
      setTeams(found.teams || []);
      setMatches(found.matches || []);
    } else {
      navigate('/');
      toast({
        title: "Erro",
        description: "Torneio não encontrado",
        variant: "destructive"
      });
    }
  }, [id, navigate, toast]);
  
  // Save tournament changes
  const saveTournament = (updatedData: any) => {
    const updatedTournament = { ...tournament, ...updatedData };
    
    const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    const updatedTournaments = tournaments.map((t: any) => 
      t.id === id ? updatedTournament : t
    );
    
    localStorage.setItem('tournaments', JSON.stringify(updatedTournaments));
    setTournament(updatedTournament);
    
    toast({
      title: "Sucesso",
      description: "Torneio atualizado com sucesso"
    });
  };
  
  // Add a new team
  const handleAddTeam = () => {
    if (!newTeam.trim()) {
      toast({
        title: "Erro",
        description: "Digite um nome para o time",
        variant: "destructive"
      });
      return;
    }
    
    if (teams.includes(newTeam.trim())) {
      toast({
        title: "Erro",
        description: "Este time já foi adicionado",
        variant: "destructive"
      });
      return;
    }
    
    const updatedTeams = [...teams, newTeam.trim()];
    setTeams(updatedTeams);
    saveTournament({ teams: updatedTeams });
    setNewTeam('');
  };
  
  // Generate matches
  const generateMatches = () => {
    if (teams.length < 2) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos 2 times para gerar partidas",
        variant: "destructive"
      });
      return;
    }
    
    let generatedMatches = [];
    
    if (tournament.format === 'knockout' || tournament.format === 'mixed') {
      // For knockout stage, create a bracket
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      const totalTeams = shuffledTeams.length;
      
      // Calculate number of byes needed
      const roundTeams = Math.pow(2, Math.ceil(Math.log2(totalTeams)));
      const byes = roundTeams - totalTeams;
      
      // First round matches
      const firstRoundMatches = [];
      let position = 0;
      
      for (let i = 0; i < totalTeams - byes; i += 2) {
        firstRoundMatches.push({
          id: `match_r1_${position}`,
          team1: shuffledTeams[i],
          team2: shuffledTeams[i + 1],
          score1: 0,
          score2: 0,
          status: 'scheduled',
          round: 1,
          position: position++
        });
      }
      
      // Add byes directly to second round
      const byeTeams = shuffledTeams.slice(totalTeams - byes);
      
      // Calculate additional rounds
      const totalRounds = Math.ceil(Math.log2(totalTeams));
      
      // Create upper rounds
      for (let round = 2; round <= totalRounds; round++) {
        const matchesInRound = Math.pow(2, totalRounds - round);
        for (let i = 0; i < matchesInRound; i++) {
          const matchId = `match_r${round}_${i}`;
          
          // For matches that receive byes
          let team1 = '';
          let team2 = '';
          
          if (round === 2 && i < byeTeams.length) {
            team1 = byeTeams[i];
          }
          
          generatedMatches.push({
            id: matchId,
            team1,
            team2,
            score1: 0,
            score2: 0,
            status: 'scheduled',
            round,
            position: i
          });
        }
      }
      
      // Connect matches to next round
      for (let round = 1; round < totalRounds; round++) {
        const roundMatches = [...firstRoundMatches, ...generatedMatches].filter(
          m => m.round === round
        );
        
        roundMatches.forEach((match, idx) => {
          const nextRoundPos = Math.floor(idx / 2);
          const nextMatchId = `match_r${round + 1}_${nextRoundPos}`;
          match.nextMatchId = nextMatchId;
        });
      }
      
      generatedMatches = [...firstRoundMatches, ...generatedMatches];
    } else if (tournament.format === 'groups') {
      // For group stage
      const teamsPerGroup = tournament.teamsPerGroup || 4;
      const numGroups = Math.ceil(teams.length / teamsPerGroup);
      const shuffledTeams = [...teams].sort(() => Math.random() - 0.5);
      
      // Assign teams to groups
      const groups: Record<string, string[]> = {};
      
      for (let i = 0; i < numGroups; i++) {
        const groupLetter = String.fromCharCode(65 + i); // A, B, C, etc.
        const startIdx = i * teamsPerGroup;
        const endIdx = Math.min(startIdx + teamsPerGroup, shuffledTeams.length);
        groups[groupLetter] = shuffledTeams.slice(startIdx, endIdx);
      }
      
      // Generate round-robin matches for each group
      Object.entries(groups).forEach(([groupLetter, groupTeams]) => {
        for (let i = 0; i < groupTeams.length; i++) {
          for (let j = i + 1; j < groupTeams.length; j++) {
            generatedMatches.push({
              id: `match_group${groupLetter}_${i}_${j}`,
              team1: groupTeams[i],
              team2: groupTeams[j],
              score1: 0,
              score2: 0,
              status: 'scheduled',
              group: groupLetter
            });
          }
        }
      });
    }
    
    setMatches(generatedMatches);
    saveTournament({ matches: generatedMatches, status: 'active' });
    setActiveTab('matches');
  };
  
  // Update match
  const handleMatchUpdate = (matchId: string, data: any) => {
    const updatedMatches = matches.map(match => {
      if (match.id === matchId) {
        return { ...match, ...data };
      }
      
      // If this match has a winner and is connected to another match
      if (match.id === matchId && data.winner && match.nextMatchId) {
        // Find the next match
        const nextMatch = matches.find(m => m.id === match.nextMatchId);
        if (nextMatch) {
          // Determine which slot to fill (team1 or team2)
          const isEvenPosition = match.position % 2 === 0;
          if (isEvenPosition) {
            nextMatch.team1 = data.winner;
          } else {
            nextMatch.team2 = data.winner;
          }
        }
      }
      
      return match;
    });
    
    setMatches(updatedMatches);
    saveTournament({ matches: updatedMatches });
    
    // Check if this is the final match
    const isFinalMatch = match => {
      if (tournament.format === 'knockout' || tournament.format === 'mixed') {
        // Find the max round
        const maxRound = Math.max(...matches.map(m => m.round || 0));
        return match.round === maxRound;
      }
      return false;
    };
    
    const updatedMatch = updatedMatches.find(m => m.id === matchId);
    if (updatedMatch && updatedMatch.status === 'completed' && isFinalMatch(updatedMatch)) {
      saveTournament({ 
        status: 'completed', 
        winner: updatedMatch.winner 
      });
      
      setShowVictoryMusic(true);
      
      toast({
        title: "Torneio Finalizado!",
        description: `Parabéns ao campeão: ${updatedMatch.winner}!`
      });
    }
  };
  
  if (!tournament) {
    return <div className="container py-8">Carregando...</div>;
  }
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="ghost" className="mr-2">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            </Link>
            
            <div>
              <h1 className="text-xl font-bold">{tournament.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <Badge className="mr-2">{tournament.sport}</Badge>
                <Badge 
                  className={`
                    ${tournament.status === 'upcoming' ? 'bg-blue-500' : 
                      tournament.status === 'active' ? 'bg-emerald-500' : 
                        tournament.status === 'completed' ? 'bg-amber-500' : ''}
                  `}
                >
                  {tournament.status === 'upcoming' ? 'Próximo' : 
                   tournament.status === 'active' ? 'Em Andamento' : 
                   tournament.status === 'completed' ? 'Finalizado' : tournament.status}
                </Badge>
              </div>
            </div>
          </div>
          
          {tournament.status === 'completed' && (
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setShowVictoryMusic(true)}
            >
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">Ver Campeão</span>
            </Button>
          )}
        </div>
      </header>
      
      <main className="container py-6">
        <Tabs 
          defaultValue="teams" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="teams" className="gap-2">
              <Users className="h-4 w-4" />
              Times
            </TabsTrigger>
            
            <TabsTrigger value="matches" className="gap-2">
              <List className="h-4 w-4" />
              Partidas
            </TabsTrigger>
            
            {(tournament.format === 'knockout' || tournament.format === 'mixed') && (
              <TabsTrigger value="bracket" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Chave
              </TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="teams" className="animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>Times / Participantes</span>
                  <Badge>{teams.length}/{tournament.teamsCount}</Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                {tournament.status === 'upcoming' && (
                  <div className="flex mb-4 gap-2">
                    <Input
                      placeholder="Nome do time ou jogador"
                      value={newTeam}
                      onChange={(e) => setNewTeam(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                    />
                    <Button onClick={handleAddTeam}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar
                    </Button>
                  </div>
                )}
                
                {teams.length > 0 ? (
                  <div className="grid gap-2">
                    {teams.map((team, index) => (
                      <div 
                        key={index}
                        className="flex justify-between items-center p-3 bg-muted/20 rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                            {index + 1}
                          </div>
                          <span>{team}</span>
                        </div>
                        
                        {tournament.winner === team && (
                          <Badge className="bg-amber-500">
                            <Trophy className="h-3 w-3 mr-1" />
                            Campeão
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum time adicionado ainda.
                  </div>
                )}
                
                {tournament.status === 'upcoming' && teams.length >= 2 && (
                  <div className="mt-6">
                    <Button 
                      className="w-full" 
                      onClick={generateMatches}
                    >
                      Gerar Partidas
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="matches" className="animate-fade-in">
            {matches.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {matches.map(match => (
                  <MatchCard
                    key={match.id}
                    {...match}
                    onMatchUpdate={handleMatchUpdate}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Nenhuma partida gerada ainda.
                  </p>
                  <Button onClick={() => setActiveTab('teams')}>
                    Ir para Times
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="bracket" className="animate-fade-in">
            {matches.length > 0 ? (
              <Card>
                <CardContent className="py-6 overflow-x-auto">
                  <TournamentBracket 
                    matches={matches.filter(m => m.round)} 
                    onMatchClick={(matchId) => {
                      setActiveTab('matches');
                      // Highlight the match somehow
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    Nenhuma partida gerada ainda.
                  </p>
                  <Button onClick={() => setActiveTab('teams')}>
                    Ir para Times
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      
      {showVictoryMusic && tournament.winner && (
        <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center p-6 z-50 animate-fade-in">
          <div className="mb-6 text-center">
            <Trophy className="h-24 w-24 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-4xl font-bold text-white mb-2">CAMPEÃO!</h2>
            <p className="text-2xl text-white mb-8">{tournament.winner}</p>
            
            <div className="bg-primary/20 p-4 rounded-lg mb-6">
              <Music className="h-6 w-6 text-primary mx-auto mb-2" />
              <p className="text-white text-sm">
                Música da vitória tocando...
                <br/>
                <span className="text-xs opacity-70">
                  Na versão premium, você pode personalizar!
                </span>
              </p>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowVictoryMusic(false)}
            className="min-w-32"
          >
            Fechar
          </Button>
        </div>
      )}
    </div>
  );
};

export default TournamentDetail;
