import express from "express";
import { addRole, removeRole, blockUser, unblockUser, deleteUser } from "../controllers/adminController.js";
import { authenticate, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add-role", authenticate, isAdmin, addRole);
router.post("/remove-role", authenticate, isAdmin, removeRole);
router.post("/block-user", authenticate, isAdmin, blockUser);
router.post("/unblock-user", authenticate, isAdmin, unblockUser);
router.post("/delete-user", authenticate, isAdmin, deleteUser);

export default router;