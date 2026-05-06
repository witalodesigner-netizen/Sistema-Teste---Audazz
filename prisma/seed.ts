import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando Seed de Dados...')

  // 1. Limpar banco (opcional, cuidado em prod)
  // await prisma.collaborator.deleteMany()
  // await prisma.client.deleteMany()

  // 2. Criar Clientes e Portal Config
  const client1 = await prisma.client.upsert({
    where: { slug: 'techflow-solutions' },
    update: {},
    create: {
      name: 'TechFlow Solutions',
      slug: 'techflow-solutions',
      status: 'Ativo',
      portalConfig: {
        create: {
          ativo: true,
          slug: 'techflow',
          corDestaque: '#0071E3',
          mensagemBoasVindas: 'Bem-vindo ao seu ecossistema de inovação!',
        }
      },
      members: {
        create: [
          {
            name: 'Ricardo Santos',
            email: 'ricardo@techflow.com',
            password: 'hashed_password_here',
            role: 'DONO',
            jobTitle: 'CEO',
            status: 'ativo',
            permissions: { create: { verFinanceiro: true, gerenciarMembros: true } }
          }
        ]
      }
    }
  })

  // 3. Criar Colaboradores
  const collab1 = await prisma.collaborator.upsert({
    where: { emailProfissional: 'lucas@audazz.com' },
    update: {},
    create: {
      nome: 'Lucas Oliveira',
      emailProfissional: 'lucas@audazz.com',
      cargo: 'Senior UI Designer',
      departamento: 'Design',
      vinculo: 'PJ',
      senioridade: 'Sênior',
      dataEntrada: new Date('2023-10-01'),
      ativo: true,
      financeiro: {
        create: {
          tipoRemuneracao: 'Salário fixo',
          salarioMensal: 8500,
          chavePix: 'lucas@pix.com'
        }
      }
    }
  })

  const collab2 = await prisma.collaborator.upsert({
    where: { emailProfissional: 'ana@audazz.com' },
    update: {},
    create: {
      nome: 'Ana Beatriz',
      emailProfissional: 'ana@audazz.com',
      cargo: 'Social Media Strategist',
      departamento: 'Social Media',
      vinculo: 'CLT',
      senioridade: 'Pleno',
      dataEntrada: new Date('2024-01-15'),
      ativo: true,
      financeiro: {
        create: {
          tipoRemuneracao: 'Salário fixo',
          salarioMensal: 5200,
          chavePix: 'ana@pix.com'
        }
      }
    }
  })

  // 4. Criar Projetos e Alocações
  const project1 = await prisma.project.create({
    data: {
      title: 'Rebranding Digital 2024',
      status: 'Em produção',
      priority: ['Alta'],
      dueDate: new Date('2024-12-31'),
      alocacoes: {
        create: {
          collaboratorId: collab1.id,
          horasSemanais: 20,
          dataInicio: new Date(),
        }
      }
    }
  })

  console.log('✅ Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
