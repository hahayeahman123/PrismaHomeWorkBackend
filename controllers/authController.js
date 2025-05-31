import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

export const register = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email is already registered
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already registered" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });

        // Find the "user" role
        const foundRole = await prisma.role.findUnique({ where: { name: "user" } });

        if (!foundRole) {
            return res.status(401).json({ msg: "User role not found" });
        }

        // Assign the user to the role
        await prisma.userRole.create({
            data: {
                userId: user.id,
                roleId: foundRole.id,
            },
        });

        res.status(201).json({ msg: "User registered successfully", user });

    } catch (err) {
        console.error(err); // <- log the full error
        res.status(500).json({ error: err.message });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            include: {
                userRoles: {
                    include: {
                        role: true
                    }
                }
            }
        });

        if (!user) return res.status(401).json({ msg: 'User not found' });
        if (user.blocked) return res.status(401).json({ msg: 'User blocked' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ msg: 'Password not correct' });

        const roles = user.userRoles.map(ur => ur.role.name);

        const token = jwt.sign(
            { id: user.id, email: user.email, roles },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ roles, token });
    } catch (err) {
        res.status(401).json({ err: err.message });
    }
};
