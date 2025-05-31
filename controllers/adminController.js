import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

//Add role
export const addRole = async (req, res) => {
    const { userId, roleName } = req.body;

    try {
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) return res.status(404).json({ message: "Role nerasta" });

        const hasRole = await prisma.userRole.findFirst({
            where: { userId, roleId: role.id },
        });
        if (hasRole) return res.status(400).json({ message: "Vartotojas jau turi sia role" });

        await prisma.userRole.create({ data: { userId, roleId: role.id } });

        res.json({ message: "Role prideta" });
    } catch (error) {
        res.status(500).json({ message: "Klaida pridedant role", error: error.message });
    }
};

//Remove role
export const removeRole = async (req, res) => {
    const { userId, roleName } = req.body;

    try {
        const role = await prisma.role.findUnique({ where: { name: roleName } });
        if (!role) return res.status(404).json({ message: "Role nerasta" });

        const userRole = await prisma.userRole.findFirst({
            where: { userId, roleId: role.id },
        });
        if (!userRole) return res.status(404).json({ message: `Vartotojas neturi roles ${roleName}` });

        await prisma.userRole.delete({ where: { id: userRole.id } });

        res.json({ message: `Vartotojui role ${roleName} pasalinta` });
    } catch (error) {
        res.status(500).json({ message: "Klaida bandant pasalinti role", error: error.message });
    }
};

//Block user
export const blockUser = async (req, res) => {
    const { userId } = req.body;

    try {
        await prisma.user.update({ where: { id: userId }, data: { blocked: true } });

        res.json({ message: "Vartotojas uzblokuotas" });
    } catch (error) {
        res.status(500).json({ message: "Klaida blokuojant vartotoja", error: error.message });
    }
};

//Unblock user
export const unblockUser = async (req, res) => {
    const { userId } = req.body;

    try {
        await prisma.user.update({ where: { id: userId }, data: { blocked: false } });

        res.json({ message: "Vartotojas atblokuotas" });
    } catch (error) {
        res.status(500).json({ message: "Klaida atblokuojant vartotoja", error: error.message });
    }
};

//Delete user
export const deleteUser = async (req, res) => {
    const { userId } = req.body;

    try {
        await prisma.user.delete({ where: { id: userId } });

        res.json({ message: "Vartotojas istrintas" });
    } catch (error) {
        res.status(500).json({ message: "Klaida trinant vartotoja", error: error.message });
    }
};