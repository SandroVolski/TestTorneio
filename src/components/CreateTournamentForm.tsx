
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SportSelector from './SportSelector';

const CreateTournamentForm: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    sport: 'football',
    format: 'groups', // 'groups', 'knockout', 'mixed'
    teamsCount: 4,
    teamsPerGroup: 4,
  });
  
  const [step, setStep] = useState(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSportSelect = (sportId: string) => {
    setFormData(prev => ({ ...prev, sport: sportId }));
  };
  
  const handleFormatChange = (value: string) => {
    setFormData(prev => ({ ...prev, format: value }));
  };
  
  const validateStep = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        toast({
          title: "Erro",
          description: "Digite um nome para o torneio",
          variant: "destructive"
        });
        return false;
      }
    } else if (step === 3) {
      if (formData.teamsCount < 2) {
        toast({
          title: "Erro",
          description: "O torneio precisa de pelo menos 2 times",
          variant: "destructive"
        });
        return false;
      }
      
      if (formData.format === 'groups' && formData.teamsPerGroup < 2) {
        toast({
          title: "Erro",
          description: "Cada grupo precisa de pelo menos 2 times",
          variant: "destructive"
        });
        return false;
      }
    }
    return true;
  };
  
  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => {
    setStep(prev => prev - 1);
  };
  
  const createTournament = () => {
    if (validateStep()) {
      // In a real app, we would save this data to a database
      const newTournament = {
        id: Date.now().toString(),
        ...formData,
        date: new Date().toISOString(),
        status: 'upcoming',
        teams: []
      };
      
      // For this demo, we'll just store in localStorage
      const tournaments = JSON.parse(localStorage.getItem('tournaments') || '[]');
      localStorage.setItem('tournaments', JSON.stringify([...tournaments, newTournament]));
      
      toast({
        title: "Torneio Criado",
        description: `${formData.name} foi criado com sucesso!`,
      });
      
      // Navigate to the tournament setup page
      navigate(`/tournament/${newTournament.id}`);
    }
  };
  
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Criar Novo Torneio</h2>
        <div className="flex items-center space-x-1">
          {[1, 2, 3].map(num => (
            <div 
              key={num}
              className={`w-3 h-3 rounded-full ${
                step === num 
                  ? 'bg-primary' 
                  : step > num 
                    ? 'bg-primary/50' 
                    : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
      
      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Torneio</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Copa de Futebol 2025"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          
          <SportSelector 
            selectedSport={formData.sport}
            onSelectSport={handleSportSelect}
          />
          
          <div className="flex justify-end">
            <Button onClick={nextStep}>
              Próximo
            </Button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <Label className="text-base mb-3 block">Formato do Torneio</Label>
            <Tabs 
              value={formData.format} 
              onValueChange={handleFormatChange}
              className="w-full"
            >
              <TabsList className="w-full">
                <TabsTrigger value="groups" className="flex-1">Fase de Grupos</TabsTrigger>
                <TabsTrigger value="knockout" className="flex-1">Mata-Mata</TabsTrigger>
                <TabsTrigger value="mixed" className="flex-1">Misto</TabsTrigger>
              </TabsList>
              
              <TabsContent value="groups" className="space-y-4 mt-4">
                <p className="text-muted-foreground">
                  Times são divididos em grupos. Os melhores de cada grupo avançam.
                </p>
              </TabsContent>
              
              <TabsContent value="knockout" className="space-y-4 mt-4">
                <p className="text-muted-foreground">
                  Eliminação direta. Quem perde está fora.
                </p>
              </TabsContent>
              
              <TabsContent value="mixed" className="space-y-4 mt-4">
                <p className="text-muted-foreground">
                  Fase de grupos seguida por mata-mata entre os classificados.
                </p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Voltar
            </Button>
            <Button onClick={nextStep}>
              Próximo
            </Button>
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Label htmlFor="teamsCount">Número de Times/Jogadores</Label>
            <Input
              id="teamsCount"
              name="teamsCount"
              type="number"
              min="2"
              placeholder="Ex: 8"
              value={formData.teamsCount}
              onChange={handleNumberChange}
            />
          </div>
          
          {(formData.format === 'groups' || formData.format === 'mixed') && (
            <div className="space-y-2">
              <Label htmlFor="teamsPerGroup">Times por Grupo</Label>
              <Input
                id="teamsPerGroup"
                name="teamsPerGroup"
                type="number"
                min="2"
                placeholder="Ex: 4"
                value={formData.teamsPerGroup}
                onChange={handleNumberChange}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.ceil(formData.teamsCount / formData.teamsPerGroup)} grupo(s) serão criados
              </p>
            </div>
          )}
          
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={prevStep}>
              Voltar
            </Button>
            <Button onClick={createTournament}>
              Criar Torneio
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTournamentForm;
