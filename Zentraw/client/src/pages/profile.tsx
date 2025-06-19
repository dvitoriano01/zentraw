import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertArtistProfileSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Music, Sparkles } from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile/1"],
  });

  const form = useForm({
    resolver: zodResolver(insertArtistProfileSchema),
    defaultValues: {
      userId: 1,
      artistName: profile?.artistName || "",
      musicalStyle: profile?.musicalStyle || "",
      mood: profile?.mood || "",
      targetAudience: profile?.targetAudience || "",
      tone: profile?.tone || "",
      mainTheme: profile?.mainTheme || "",
      collaborations: profile?.collaborations || [],
    },
  });

  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      setIsGenerating(true);
      const response = await apiRequest("POST", "/api/profile", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile/1"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      toast({
        title: "Perfil criado com sucesso!",
        description: "Biografia e press release foram gerados automaticamente.",
      });
      setIsGenerating(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar perfil",
        description: error.message,
        variant: "destructive",
      });
      setIsGenerating(false);
    },
  });

  const onSubmit = (data: any) => {
    createProfileMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Perfil do Artista</h2>
              <p className="text-gray-600">Configure suas informações para gerar conteúdo personalizado</p>
            </div>
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">IA Integrada</span>
            </div>
          </div>
        </header>

        <div className="p-6 max-w-4xl mx-auto">
          {profile && (profile as any).shortBio && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Conteúdo Gerado</h3>
                
                {(profile as any).shortBio && (
                  <div className="mb-4">
                    <Label className="font-medium">Biografia Curta</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm">{(profile as any).shortBio}</p>
                    </div>
                  </div>
                )}

                {(profile as any).longBio && (
                  <div className="mb-4">
                    <Label className="font-medium">Biografia Completa</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{(profile as any).longBio}</p>
                    </div>
                  </div>
                )}

                {(profile as any).pressRelease && (
                  <div>
                    <Label className="font-medium">Press Release</Label>
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm whitespace-pre-wrap">{(profile as any).pressRelease}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-6">
                {profile ? "Atualizar Perfil" : "Criar Perfil do Artista"}
              </h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="artistName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Artista</FormLabel>
                          <FormControl>
                            <Input placeholder="DJ Supreme" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="musicalStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estilo Musical</FormLabel>
                          <FormControl>
                            <Input placeholder="House, Techno, Electronic" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mood"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mood/Vibe</FormLabel>
                          <FormControl>
                            <Input placeholder="Energético, Melódico, Dark" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="targetAudience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Público-Alvo</FormLabel>
                          <FormControl>
                            <Input placeholder="Clubbers, Festivais, Underground" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tom da Comunicação</FormLabel>
                          <FormControl>
                            <Input placeholder="Profissional, Casual, Criativo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="mainTheme"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tema Principal</FormLabel>
                          <FormControl>
                            <Input placeholder="Inovação, Tradição, Experimentação" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Gerando com IA...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        {profile ? "Atualizar e Regenerar" : "Criar Perfil e Gerar Conteúdo"}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}