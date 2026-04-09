import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PerfilTab } from "@/components/tabs/perfil-tab"
import { SessoesTab } from "@/components/tabs/sessoes-tab"
import { MarcosTab } from "@/components/tabs/marcos-tab"
import { PlanosTratamentoTab } from "@/components/tabs/planos-tratamento-tab"
import { ProgressoTab } from "@/components/tabs/progresso-tab"

interface PacienteTabsProps {
  pacienteId: string
}

export function PacienteTabs({ pacienteId }: PacienteTabsProps) {
  return (
    <Tabs defaultValue="perfil" className="space-y-4">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="perfil">Perfil</TabsTrigger>
        <TabsTrigger value="sessoes">Sessões</TabsTrigger>
        <TabsTrigger value="marcos">Marcos</TabsTrigger>
        <TabsTrigger value="planos">Planos</TabsTrigger>
        <TabsTrigger value="progresso">Progresso</TabsTrigger>
      </TabsList>

      <TabsContent value="perfil">
        <PerfilTab pacienteId={pacienteId} />
      </TabsContent>

      <TabsContent value="sessoes">
        <SessoesTab pacienteId={pacienteId} />
      </TabsContent>

      <TabsContent value="marcos">
        <MarcosTab pacienteId={pacienteId} />
      </TabsContent>

      <TabsContent value="planos">
        <PlanosTratamentoTab pacienteId={pacienteId} />
      </TabsContent>

      <TabsContent value="progresso">
        <ProgressoTab pacienteId={pacienteId} />
      </TabsContent>
    </Tabs>
  )
}
