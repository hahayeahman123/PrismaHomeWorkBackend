import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import cors from 'cors';

dotenv.config();

const app = express();


app.use(cors());

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);


app.get("/", (req, res) => {
    res.send("Auth and role Back End");
});



app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});