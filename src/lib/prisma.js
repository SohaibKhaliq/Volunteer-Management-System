// Provide a safe async getter for PrismaClient so modules (including Edge
// middleware) don't instantiate Prisma at module evaluation time.
export async function getPrisma() {
    if (globalThis.__prisma) return globalThis.__prisma;
    const { PrismaClient } = await import('@prisma/client');
    globalThis.__prisma = new PrismaClient();
    return globalThis.__prisma;
}

export default null;
