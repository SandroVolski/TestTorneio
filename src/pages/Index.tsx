
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Plus, Calendar, List, MoonStar, Sun } from 'lucide-react';
import TournamentCard, { Tournament } from '@/components/TournamentCard';
import { useTheme } from '@/contexts/ThemeContext';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  useEffect(() => {
    // In a real app, this would be an API call
    const storedTournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
    
    // If there are no tournaments, let's add some examples
    if (!storedTournaments.length) {
      const exampleTournaments: Tournament[] = [
        {
          id: '1',
          name: 'Copa de Futebol 2025',
          sportType: 'football',
          date: '2025-01-15',
          teamsCount: 16,
          status: 'active'
        },
        {
          id: '2',
          name: 'Torneio de Basquete da Escola',
          sportType: 'basketball',
          date: '2024-11-20',
          teamsCount: 8,
          status: 'completed',
          winner: 'Time Lakers'
        },
        {
          id: '3',
          name: 'Campeonato de Truco',
          sportType: 'truco',
          date: '2025-02-28',
          teamsCount: 12,
          status: 'upcoming'
        }
      ];
      
      localStorage.setItem('tournaments', JSON.stringify(exampleTournaments));
      setTournaments(exampleTournaments);
    } else {
      setTournaments(storedTournaments);
    }
  }, []);
  
  const filteredTournaments = tournaments.filter(tournament => {
    if (filter === 'all') return true;
    if (filter === 'active') return tournament.status === 'active' || tournament.status === 'upcoming';
    if (filter === 'completed') return tournament.status === 'completed';
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex justify-between items-center py-4">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-primary mr-2" />
            <h1 className="text-2xl font-bold">Quick Match Master</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
            </Button>
            
            <Button 
              onClick={() => navigate('/create')}
              className="hidden sm:flex"
            >
              <Plus className="h-4 w-4 mr-2" /> 
              Novo Torneio
            </Button>
            
            <Button 
              onClick={() => navigate('/create')}
              className="sm:hidden"
              size="icon" 
              title="Criar Novo Torneio"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      <main className="container py-6">
        <section className="mb-8">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-3xl font-bold mb-3">Organize Torneios com Facilidade</h2>
            <p className="text-muted-foreground">
              Crie e gerencie torneios de qualquer modalidade em minutos.
              Sem cadastros complicados, rápido e simples.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-primary/10 rounded-lg p-6 flex flex-col items-center text-center">
              <Trophy className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Crie um Torneio</h3>
              <p className="text-muted-foreground mb-4">
                Escolha a modalidade, defina o formato e adicione os times. Tudo em poucos cliques.
              </p>
              <Button 
                onClick={() => navigate('/create')}
                className="mt-auto"
              >
                <Plus className="h-4 w-4 mr-2" /> 
                Novo Torneio
              </Button>
            </div>
            
            <div className="bg-secondary rounded-lg p-6 flex flex-col items-center text-center">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Gerencie Jogos</h3>
              <p className="text-muted-foreground mb-4">
                Acompanhe resultados, atualize placares e visualize a classificação em tempo real.
              </p>
              <Button 
                variant="outline"
                className="mt-auto"
                onClick={() => {
                  if (filteredTournaments.length) {
                    navigate(`/tournament/${filteredTournaments[0].id}`);
                  } else {
                    navigate('/create');
                  }
                }}
              >
                <List className="h-4 w-4 mr-2" /> 
                {tournaments.length ? 'Ver Torneios' : 'Criar Primeiro Torneio'}
              </Button>
            </div>
          </div>
        </section>
        
        {tournaments.length > 0 && (
          <section>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Seus Torneios</h2>
              
              <Tabs 
                defaultValue="all" 
                onValueChange={(value) => setFilter(value as any)}
              >
                <TabsList>
                  <TabsTrigger value="all">Todos</TabsTrigger>
                  <TabsTrigger value="active">Ativos</TabsTrigger>
                  <TabsTrigger value="completed">Finalizados</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTournaments.map(tournament => (
                <TournamentCard
                  key={tournament.id}
                  tournament={tournament}
                />
              ))}
            </div>
            
            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Nenhum torneio {filter === 'active' ? 'ativo' : 'finalizado'} encontrado.
                </p>
                <Button onClick={() => setFilter('all')}>
                  Ver Todos
                </Button>
              </div>
            )}
          </section>
        )}
      </main>
      
      <footer className="border-t mt-12">
        <div className="container py-6 text-center text-muted-foreground">
          <p>Quick Match Master &copy; 2025</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
