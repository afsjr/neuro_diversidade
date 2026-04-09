import { Suspense } from "react"
import { PacienteHeader } from "@/components/paciente-header"
import { PacienteTabs } from "@/components/paciente-tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface PacientePageProps {
  params: {
    id: string
  }
}

export default function PacientePage({ params }: PacientePageProps) {
  return (
    <div className="space-y-6">
      <Suspense fallback={<Skeleton className="h-32 w-full" />}>
        <PacienteHeader pacienteId={params.id} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <PacienteTabs pacienteId={params.id} />
      </Suspense>
    </div>
  )
}
