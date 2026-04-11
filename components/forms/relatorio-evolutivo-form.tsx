"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { FileText, Download, Printer, Copy, Loader2, Sparkles } from "lucide-react"
import { getPacienteStats, type Paciente } from "@/lib/supabase"

interface RelatorioEvolutivoFormProps {
  paciente: Paciente
  onCancel: () => void
}

export function RelatorioEvolutivoForm({ paciente, onCancel }: RelatorioEvolutivoFormProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [reportContent, setReportContent] = useState("")

  const generateReport = async () => {
    setLoading(true)
    try {
      const stats = await getPacienteStats(paciente.id)
      
      const prompt = `
RELATÓRIO DE EVOLUÇÃO CLÍNICA
--------------------------------------------------
PACIENTE: ${paciente.nome}
IDADE: ${paciente.data_nascimento ? calculateAge(paciente.data_nascimento) : "---"} anos
DIAGNÓSTICO: ${paciente.diagnostico || "Não informado"}
DATA: ${new Date().toLocaleDateString("pt-BR")}

RESUMO DE ATIVIDADES:
- Total de sessões realizadas: ${stats.sessoes}
- Marcos de desenvolvimento alcançados: ${stats.marcosAlcancados}/${stats.marcos}
- Taxa de sucesso em objetivos: ${stats.marcos > 0 ? Math.round((stats.marcosAlcancados / stats.marcos) * 100) : 0}%

DADOS QUALITATIVOS (MÉTRICAS):
${stats.metricas.map(m => `- ${m.categoria}: Nível ${m.valor}/10 (${new Date(m.data_registro).toLocaleDateString("pt-BR")})`).join("\n")}

PARECER CLÍNICO EVOLUTIVO:
O paciente apresenta uma trajetória de ${stats.marcosAlcancados > 0 ? "evolução constante" : "acompanhamento inicial"}, com destaque para o engajamento nas sessões. As métricas indicam estabilidade nas áreas de desenvolvimento monitoradas.

RECOMENDAÇÕES:
1. Manutenção das terapias atuais.
2. Foco nos marcos pendentes de ${stats.metricas[0]?.categoria || "maior necessidade"}.
3. Reavaliação em 90 dias.

--------------------------------------------------
Assinatura do Profissional Responsável
`.trim()

      setReportContent(prompt)
      toast({
        title: "Relatórios Gerado",
        description: "Os dados foram consolidados com sucesso.",
      })
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível consolidar os dados.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  function calculateAge(dateString: string) {
    const today = new Date()
    const birthDate = new Date(dateString)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(reportContent)
    toast({ title: "Copiado", description: "Relatório copiado para a área de transferência." })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Gerador de Relatório Evolutivo</h3>
        {!reportContent && (
          <Button onClick={generateReport} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Consolidar Dados e Gerar
          </Button>
        )}
      </div>

      {reportContent ? (
        <div className="space-y-4">
          <Textarea 
            value={reportContent} 
            onChange={(e) => setReportContent(e.target.value)}
            className="min-h-[400px] font-mono text-sm p-4 leading-relaxed"
          />
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" />
              Copiar Texto
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button onClick={onCancel}>
              Fechar
            </Button>
          </div>
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p>Clique no botão acima para consolidar todas as sessões, métricas e marcos em um relatório formatado para a família.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
