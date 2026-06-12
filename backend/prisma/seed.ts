import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Inicializar Liquidez
  await prisma.liquidity.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      amount: 145000
    }
  });

  // Inicializar Directores
  const d1 = await prisma.director.upsert({
    where: { token: '0x3F8a...9B2c' },
    update: {},
    create: {
      name: 'Carlos Mendoza',
      role: 'Director General',
      token: '0x3F8a...9B2c',
      powerLevel: 'Firma Clase A (Sin Límite)',
      status: 'active'
    }
  });
  
  const d2 = await prisma.director.upsert({
    where: { token: '0x1A4b...7C9d' },
    update: {},
    create: {
      name: 'Ana Silva',
      role: 'Gerente de Tesorería',
      token: '0x1A4b...7C9d',
      powerLevel: 'Firma Clase B (Hasta $50,000)',
      status: 'active'
    }
  });

  const d3 = await prisma.director.upsert({
    where: { token: '0x8E2f...4D1a' },
    update: {},
    create: {
      name: 'Luis Herrera',
      role: 'Representante Legal Adjunto',
      token: '0x8E2f...4D1a',
      powerLevel: 'Poder Especial (Compras)',
      status: 'revoked'
    }
  });

  // Inicializar Facturas
  const f1 = await prisma.invoice.upsert({
    where: { id: 'FAC-2026-001' },
    update: {},
    create: {
      id: 'FAC-2026-001',
      client: 'Automercados Plaza',
      amount: 12500,
      dueDate: 'Vence en 60 días',
      risk: 'Riesgo AAA',
      status: 'pending'
    }
  });

  const f2 = await prisma.invoice.upsert({
    where: { id: 'FAC-2026-002' },
    update: {},
    create: {
      id: 'FAC-2026-002',
      client: 'Constructora Sigo C.A.',
      amount: 45000,
      dueDate: 'Vence en 90 días',
      risk: 'Riesgo AA',
      status: 'pending'
    }
  });

  const f3 = await prisma.invoice.upsert({
    where: { id: 'FAC-2026-003' },
    update: {},
    create: {
      id: 'FAC-2026-003',
      client: 'Distribuidora del Sur',
      amount: 8200,
      dueDate: 'Vence en 30 días',
      risk: 'Riesgo A',
      status: 'pending'
    }
  });

  // Inicializar Retenciones
  const r1 = await prisma.retention.upsert({
    where: { id: 'RET-0091' },
    update: {},
    create: {
      id: 'RET-0091',
      date: '12/06/2026 14:30',
      client: 'Agropecuaria Los Llanos C.A.',
      baseAmount: 45000,
      ivaRetained: 3600,
      igtfRetained: 1350,
      status: 'synced',
      seniatCode: 'SEN-2026-A8F2'
    }
  });

  const r2 = await prisma.retention.upsert({
    where: { id: 'RET-0092' },
    update: {},
    create: {
      id: 'RET-0092',
      date: '12/06/2026 15:45',
      client: 'Distribuidora Central S.A.',
      baseAmount: 18500,
      ivaRetained: 1480,
      igtfRetained: 555,
      status: 'synced',
      seniatCode: 'SEN-2026-B9G3'
    }
  });

  console.log('Seed ejecutado correctamente.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
