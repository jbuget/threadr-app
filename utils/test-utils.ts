import { prisma } from '../prisma/db'

async function clearData() {
    try {
        await prisma.thread.deleteMany();
        await prisma.version.deleteMany();
        await prisma.settings.deleteMany();
    } catch (error) {
        console.error("Erreur lors de l'exécution du script SQL:", error);
    }
}

export { clearData };