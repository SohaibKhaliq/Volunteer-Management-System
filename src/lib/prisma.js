import { PrismaClient } from '@prisma/client';

let prisma;

if (globalThis.prisma) {
    prisma = globalThis.prisma;
} else {
    prisma = new PrismaClient();
    globalThis.prisma = prisma;
}

export default prisma;
