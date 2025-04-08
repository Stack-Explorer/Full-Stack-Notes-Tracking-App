import express from "express";
import { getNotes, postNote ,updateNote, deleteNote  } from "../functionality/notes.functionality.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute,getNotes);
router.post("/addNote",protectRoute, postNote);
router.put("/note/:id", protectRoute, updateNote);
router.delete("/note/:id", protectRoute, deleteNote);

export default router;