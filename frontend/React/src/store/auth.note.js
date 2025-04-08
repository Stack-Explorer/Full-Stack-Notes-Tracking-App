import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-toastify";

export const useNoteStore = create((set) => ({

    notes: [],

    postNote: async (noteContent) => {
        try {
            console.log(noteContent)
            const res = await axiosInstance.post("/notes/addNote", noteContent);
            set((state) => ({
                notes: [...state.notes, res.data.newNote],
            }))
            toast.success("Note saved successfully");
        } catch (error) {
            console.error("Error in posting note");
            toast.error(error.response?.data?.message);
        }
    },
    
        getNote: async () => {
            try {
                const res = await axiosInstance.get("/notes/");
                set({ notes: res.data.notes });
            } catch (error) {
                console.error("Error in getting note");
                toast.error(error.response?.data?.message);
            }
        },

    deleteNote: async (noteId) => {
        if (!noteId) {
            toast.error("Invalid Note ID");
            return;
        }

        try {
            await axiosInstance.delete(`/notes/note/${noteId}`);

            set((state) => ({
                notes: state.notes.filter((note) => String(note._id) !== String(noteId)),  // ✅ Ensure `_id` is always a string
            }));

            toast.info("Note deleted successfully");
        } catch (error) {
            console.error("Error deleting note:", error);
            toast.error(error.response?.data?.message || "Failed to delete note");
        }
    },

    editNote: async (noteId, updatedContent) => {
        try {
            const res = await axiosInstance.put(`/notes/note/${noteId}`, updatedContent);
            set((state) => ({
                notes: state.notes.map((note) =>
                    String(note._id) === String(noteId)
                        ? { ...note, title: updatedContent.title, content: updatedContent.content }
                        : note
                ),
            }));
            toast.success("Note updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update note");
        }
    }

}))