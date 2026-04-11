// AI Service for Treatment Plan Recommendations
// This service simulates an LLM integration for treatment plan suggestions.
// In a production environment, this would call an API like OpenAI or Gemini.

import { Paciente } from "./supabase";

export interface AIRecommendation {
  titulo: string;
  descricao: string;
  objetivos: string[];
  justificativa: string;
}

/**
 * Simulates an AI recommendation for a treatment plan.
 * Uses patient data to generate structured suggestions without hallucinations.
 */
export async function getAIPlanoRecommendation(paciente: Paciente): Promise<AIRecommendation> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const diagnostico = paciente.diagnostico?.toLowerCase() || "";
  
  // Base recommendations on diagnosis to avoid hallucinations
  if (diagnostico.includes("tea") || diagnostico.includes("autismo")) {
    return {
      titulo: "Plano de Intervenção ABA",
      descricao: "Foco em habilidades de comunicação funcional, interação social e redução de comportamentos disruptivos através de reforço positivo.",
      objetivos: [
        "Aumentar o contato visual espontâneo em 50%",
        "Desenvolver uso de comunicação alternativa (PECS/Digital) para pedidos básicos",
        "Reduzir episódios de desregulação sensorial através de técnicas de acomodação"
      ],
      justificativa: "Paciente apresenta barreiras significativas na comunicação social e regulação, típicas do quadro de TEA, necessitando de suporte estruturado."
    };
  }

  if (diagnostico.includes("tdah")) {
    return {
      titulo: "Treino de Funções Executivas",
      descricao: "Desenvolvimento de estratégias de organização, controle inibitório e atenção sustentada através de métodos cognitivo-comportamentais.",
      objetivos: [
        "Implementar sistema de checklist visual para rotinas diárias",
        "Aumentar tempo de foco em tarefa única para 15 minutos",
        "Desenvolver estratégias de pausa ativa para regulação de impulsividade"
      ],
      justificativa: "Dificuldades em planejamento e manutenção da atenção prejudicam o desempenho acadêmico e social, justificando intervenção focada em funções executivas."
    };
  }

  // Default recommendation
  return {
    titulo: "Plano de Estimulação Neurocognitiva Geral",
    descricao: "Protocolo de estimulação das funções cognitivas básicas para promover o desenvolvimento global e autonomia.",
    objetivos: [
      "Estimular memória de trabalho e processamento visual",
      "Promover ganho de autonomia em atividades de vida diária",
      "Monitorar marcos de desenvolvimento conforme a idade"
    ],
    justificativa: "Necessidade de acompanhamento preventivo e estimulação de base para garantir alcance dos marcos de desenvolvimento."
  };
}
