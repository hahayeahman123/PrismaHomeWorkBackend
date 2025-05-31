import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const plainPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const adminEmail = "admin@gmail.com";

    let adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (adminUser) {
        adminUser = await prisma.user.update({
            where: { email: adminEmail },
            data: { password: hashedPassword },
        });
        console.log("Admin slaptažodis atnaujintas");
    } else {
        adminUser = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
            },
        });
        console.log("Admin vartotojas sukurtas");
    }

    let adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
    if (!adminRole) {
        adminRole = await prisma.role.create({ data: { name: "admin" } });
        console.log("Admin role sukurta");
    }

    const alreadyHasRole = await prisma.userRole.findFirst({
        where: { userId: adminUser.id, roleId: adminRole.id },
    });

    if (!alreadyHasRole) {
        await prisma.userRole.create({
            data: {
                userId: adminUser.id,
                roleId: adminRole.id,
            },
        });
        console.log("Admin role admin vartotojui prideta");
    } else {
        console.log("Admin useris jau turi admin role");
    }

    console.log("---------------------------");
    console.log("Admin prisijungimo duomenys");
    console.log("El.pastas:", adminEmail);
    console.log("Slaptazodis:", plainPassword);
    console.log("---------------------------");
}

main()
    .catch((err) => {
        console.log(err.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });