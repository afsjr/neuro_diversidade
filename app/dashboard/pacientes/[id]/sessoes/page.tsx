import { Suspense } from "react"
import { SessoesTab } from "@/components/tabs/sessoes-tab"
import { PacienteHeader } from "@/components/paciente-header"
import { Skeleton } from "@/components/ui/skeleton"

interface SessoesPageProps {
  params: {
    id: string
  }
}

export default function SessoesPage({ params }: SessoesPageProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <PacienteHeader pacienteId={params.id} />
      </Suspense>

      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
        <Suspense fallback={<Skeleton className="h-96 w-full" />}>
          <SessoesTab pacienteId={params.id} />
        </Suspense>
      </div>
    </div>
  )
}
