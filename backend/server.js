import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./utils/mdb.connection.js";
import authRoutes from "./routes/auth.route.js"
import noteRoutes from "./routes/auth.note.js"
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
})