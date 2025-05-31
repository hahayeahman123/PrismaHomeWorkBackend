import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticate = (req, res, next)=>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(401).json({msg: 'Prisijunk, kad gautum Token'})
    }

    const Token = authHeader.split(' ')[1];
    try{
        const decoded = jwt.verify(Token, process.env.JWT_SECRET);

        req.user = decoded;
        next()
    }catch(err){
        res.status(401).json({msg: 'Token negalioja'})
    }
}

export const isAdmin = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Neleista" });

    const adminRole = await prisma.role.findUnique({ where: { name: "admin" } });
    if (!adminRole) return res.status(500).json({ message: "Admin role nerasta" });

    const userRole = await prisma.userRole.findFirst({
        where: { userId: userId, roleId: adminRole.id },
    });

    if (!userRole) return res.status(403).json({ message: "Prieiga draudziama, reikia admin roles" });

    next();
};