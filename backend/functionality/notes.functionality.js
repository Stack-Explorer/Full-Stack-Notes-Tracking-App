import Note from "../models/notes.model.js";

export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({user : req.user._id});
        res.status(200).json({ notes });
    } catch (err) {
        console.log(`Error in getNotes controller : ${err.message}`)
        return res.status(500).json({ error: "Failed to fetch notes" });
    }
}

export const postNote = async (req, res) => {
    try {
        console.log(req.body)
        const { title, content } = req.body;
        const newNote = new Note({
            title,
            content,
            user : req.user._id
        });

        await newNote.save();

        console.log("Note saved !")

        return res.status(201).json({ newNote, message: "New Note created successfully !" });

    } catch (error) {
        console.log("Error in postNote controller : ", error.message);
        return res.status(500).json({ error: "Error creating new Note !" });
    }
}
export const updateNote = async (req, res) => {
    try {
        console.log(req.body)
        const { title, content } = req.body;
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Note ID is required" });
        }

        const note = await Note.findOne({ _id: id, user: req.user._id });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        note.title = title;
        note.content = content;
        await note.save();

        return res.status(200).json({note, message: "Note updated successfully" });

    } catch (error) {
        console.error("Error in updateNote controller:", error.message);
        return res.status(500).json({ error: "Error updating Note!" });
    }
};


export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Note ID is required" });
        }

        const note = await Note.findOneAndDelete({ _id: id, user: req.user._id });

        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }

        return res.status(200).json({ message: "Note deleted successfully!" });

    } catch (error) {
        console.error("Error in deleteNote controller:", error.message);
        return res.status(500).json({ error: "Error deleting Note!" });
    }
};