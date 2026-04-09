import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface PerfilTabProps {
  pacienteId: string
}

export function PerfilTab({ pacienteId }: PerfilTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Dados básicos do paciente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
            <p className="text-gray-900 dark:text-white">Ana Silva</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</label>
            <p className="text-gray-900 dark:text-white">15/03/2015</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Idade</label>
            <p className="text-gray-900 dark:text-white">9 anos</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Responsável</CardTitle>
          <CardDescription>Dados de contato do responsável</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Nome do Responsável</label>
            <p className="text-gray-900 dark:text-white">Maria Silva</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
            <p className="text-gray-900 dark:text-white">(11) 99999-9999</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <p className="text-gray-900 dark:text-white">maria.silva@email.com</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Informações Clínicas</CardTitle>
          <CardDescription>Diagnóstico e observações médicas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnóstico Principal</label>
            <p className="text-gray-900 dark:text-white">TEA - Transtorno do Espectro Autista</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Observações</label>
            <p className="text-gray-900 dark:text-white">
              Paciente apresenta características do espectro autista com necessidade de acompanhamento especializado.
              Demonstra boa evolução com terapias comportamentais.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
