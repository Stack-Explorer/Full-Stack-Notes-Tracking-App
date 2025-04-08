import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
},
);

const Note = mongoose.model("Note", notesSchema);

export default Note;