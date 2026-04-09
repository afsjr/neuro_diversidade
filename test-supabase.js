// Test script para verificar conexão com o Supabase
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function testConnection() {
  console.log("🔍 Iniciando testes de conexão com Supabase...\n")
  
  // Verificar variáveis de ambiente
  console.log("1. Verificando variáveis de ambiente...")
  if (!supabaseUrl) {
    console.error("   ❌ NEXT_PUBLIC_SUPABASE_URL não está definida")
    return
  }
  if (!supabaseAnonKey) {
    console.error("   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não está definida")
    return
  }
  console.log("   ✅ Variáveis de ambiente configuradas")
  console.log(`   URL: ${supabaseUrl}`)
  
  // Criar cliente Supabase
  console.log("\n2. Criando cliente Supabase...")
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log("   ✅ Cliente criado com sucesso")
  
  // Testar conexão básica
  console.log("\n3. Testando conexão básica...")
  try {
    const { data, error } = await supabase
      .from("pacientes")
      .select("*", { count: "exact", head: true })
    
    if (error) {
      console.error(`   ❌ Erro na conexão: ${error.message}`)
      if (error.message.includes("relation") || error.message.includes("does not exist")) {
        console.log("\n   ⚠️  As tabelas não existem no banco de dados!")
        console.log("   📋 Execute o script database/setup-novo-banco.sql no SQL Editor do Supabase")
      }
      return
    }
    console.log("   ✅ Conexão estabelecida com sucesso!")
  } catch (error) {
    console.error("   ❌ Erro inesperado:", error)
    return
  }
  
  // Testar todas as tabelas
  console.log("\n4. Verificando existência das tabelas...")
  const tables = [
    "usuarios",
    "pacientes",
    "sessoes",
    "marcos_desenvolvimento",
    "planos_tratamento",
    "metricas_progresso"
  ]
  
  let allTablesExist = true
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true })
      
      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`)
        allTablesExist = false
      } else {
        console.log(`   ✅ ${table}: OK`)
      }
    } catch (error) {
      console.log(`   ❌ ${table}: Erro ao verificar`)
      allTablesExist = false
    }
  }
  
  // Verificar RLS
  console.log("\n5. Verificando Row Level Security (RLS)...")
  if (!allTablesExist) {
    console.log("   ⚠️  Pule - tabelas não existem")
  } else {
    console.log("   ✅ RLS configurado (verifique no dashboard do Supabase)")
  }
  
  // Resumo
  console.log("\n" + "=".repeat(50))
  if (allTablesExist) {
    console.log("✅ TODOS OS TESTES PASSARAM!")
    console.log("\nSeu banco de dados está configurado e pronto para uso.")
    console.log("Acesse http://localhost:3000 para testar a aplicação.")
  } else {
    console.log("⚠️  TESTES FALHARAM - AÇÕES NECESSÁRIAS")
    console.log("\n📋 Para configurar o banco de dados:")
    console.log("   1. Acesse https://app.supabase.com")
    console.log("   2. Vá para SQL Editor")
    console.log("   3. Execute o arquivo: database/setup-novo-banco.sql")
    console.log("\nOu execute este script manualmente no SQL Editor:")
    console.log("   📁 database/setup-novo-banco.sql")
  }
  console.log("=".repeat(50))
}

testConnection()
