import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Paciente } from "@/lib/supabase"
import { calculateAge } from "@/lib/utils"

interface PacienteCardProps {
  paciente: Paciente
}

export function PacienteCard({ paciente }: PacienteCardProps) {
  const idade = calculateAge(paciente.data_nascimento)
  const iniciais = paciente.nome
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "inativo":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "alta":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <Link href={`/dashboard/pacientes/${paciente.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={`/placeholder-avatar.jpg`} />
              <AvatarFallback>{iniciais}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{paciente.nome}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">{idade} anos</p>
            </div>
            <Badge className={getStatusColor(paciente.status)}>{paciente.status}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Responsável</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{paciente.responsavel}</p>
            </div>
            {paciente.diagnostico && (
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Diagnóstico</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{paciente.diagnostico}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
