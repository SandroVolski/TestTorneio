
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CreateTournamentForm from '@/components/CreateTournamentForm';

const CreateTournament: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background z-10">
        <div className="container flex items-center py-4">
          <Link to="/">
            <Button variant="ghost" className="mr-4">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
          <h1 className="text-xl font-bold">Criar Novo Torneio</h1>
        </div>
      </header>
      
      <main className="container py-6">
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-6">
            <CreateTournamentForm />
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default CreateTournament;
