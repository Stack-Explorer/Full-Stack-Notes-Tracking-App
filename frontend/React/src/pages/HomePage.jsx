import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import CreateArea from "../components/CreateArea";
import { toast } from "react-toastify";
import { useNoteStore } from "../store/auth.note.js";
import Note from "../components/Note.jsx";
import Greetings from "../components/Greetings.jsx";

function HomePage() {
  const { notes, getNote, postNote } = useNoteStore();

  useEffect(() => {
    getNote();
  }, []);

  function addNote(newNote) {
    postNote(newNote);
  }

  function deleteNote(id) {
    useNoteStore.getState().deleteNote(id);  // ✅ Use the correct `deleteNote` function
  }


  return (
    <>
      <Greetings />
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto p-4">
          <CreateArea onAdd={addNote} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {notes.map((noteItem) => (
              <Note
                key={noteItem._id}  // ✅ Use MongoDB ObjectID as key
                id={noteItem._id}    // ✅ Pass MongoDB _id instead of index
                title={noteItem.title}
                content={noteItem.content}
                onDelete={deleteNote}
              />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default HomePage;