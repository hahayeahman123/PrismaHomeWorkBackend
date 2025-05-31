import { body } from "express-validator";

export const registerValidator = [
    body("email").isEmail().withMessage("Neteisingas el. pasto adresas"),
    body("password").isLength({ min: 6 }).withMessage("Slaptazodis turi buti bent 6 simboliu ilgio"),
];

export const loginValidator = [
    body("email").isEmail().withMessage("Neteisingas el. pasto adresas"),
    body("password").notEmpty().withMessage("Slaptazodis privalomas"),
];
