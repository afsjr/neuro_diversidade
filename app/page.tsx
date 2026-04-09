import { LoginForm } from "@/components/login-form"
import { Brain } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">NeuroAcompanha Pro</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sistema profissional de acompanhamento neurológico
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
