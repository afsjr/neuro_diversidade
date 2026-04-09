"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Trash2, Download, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { uploadDocumento, getDocumentosByPaciente, deleteDocumento, type Documento } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

interface DocumentosTabProps {
  pacienteId: string
}

export function DocumentosTab({ pacienteId }: DocumentosTabProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documentos, setDocumentos] = useState<Documento[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    loadDocumentos()
  }, [pacienteId])

  const loadDocumentos = async () => {
    try {
      setLoading(true)
      const { data, error } = await getDocumentosByPaciente(pacienteId)
      if (error) throw error
      setDocumentos(data || [])
    } catch (err) {
      console.error("Erro ao carregar documentos:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    try {
      setUploading(true)
      const { data, error } = await uploadDocumento(pacienteId, user.id, file)
      if (error) throw error
      
      toast({ title: "Sucesso", description: "Documento enviado com sucesso!" })
      loadDocumentos()
    } catch (err: any) {
      toast({ 
        title: "Erro no upload", 
        description: err.message || "Não foi possível enviar o arquivo.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string, url: string) => {
    if (!confirm("Tem certeza que deseja excluir este documento?")) return

    try {
      const { error } = await deleteDocumento(id, url)
      if (error) throw error
      
      toast({ title: "Excluído", description: "Documento removido." })
      setDocumentos(documentos.filter(d => d.id !== id))
    } catch (err: any) {
      toast({ title: "Erro", description: "Falha ao excluir.", variant: "destructive" })
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Documentos e Laudos</CardTitle>
            <CardDescription>Armazene exames, laudos e documentos do paciente</CardDescription>
          </div>
          <div className="relative">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button asChild disabled={uploading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {uploading ? "Enviando..." : "Enviar Documento"}
              </label>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : documentos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documentos.map((doc) => (
                <div 
                  key={doc.id} 
                  className="flex items-center p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-md mr-4">
                    <FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate" title={doc.nome}>
                      {doc.nome}
                    </p>
                    <p className="text-xs text-gray-500">{formatSize(doc.tamanho)}</p>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" asChild>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(doc.id, doc.url)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nenhum documento encontrado para este paciente.</p>
              <p className="text-sm text-gray-400">Faça o upload de laudos, exames ou fotos.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
