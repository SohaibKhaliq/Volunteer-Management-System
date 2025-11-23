// Provide a safe async getter for PrismaClient so modules (including Edge
// middleware) don't instantiate Prisma at module evaluation time.
export async function getPrisma() {
    if (globalThis.__prisma) return globalThis.__prisma;

    // Try dynamic import first (ESM). If that fails, fall back to require.
    let mod;
    try {
        mod = await import('@prisma/client');
    } catch (errImport) {
        try {
            // eslint-disable-next-line global-require, node/no-missing-require
            // (use require as a fallback if dynamic import isn't available)
            // This may throw in strict ESM contexts, so wrap it.
            // eslint-disable-next-line no-undef
            mod = require('@prisma/client');
        } catch (errRequire) {
            console.error('Failed to load @prisma/client via import and require', { errImport, errRequire });
            throw errImport;
        }
    }

    const PrismaClient = mod?.PrismaClient || mod?.default?.PrismaClient || mod?.default || mod;

    try {
        globalThis.__prisma = new PrismaClient();
        return globalThis.__prisma;
    } catch (err) {
        // Log helpful debug info and rethrow
        console.error('PrismaClient initialization error', err);
        console.error('Prisma module keys:', Object.keys(mod || {}));
        throw err;
    }
}

export default null;
