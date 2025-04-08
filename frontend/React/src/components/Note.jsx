import React, { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from '@mui/icons-material/Edit';
import { useNoteStore } from "../store/auth.note.js";
import { toast } from "react-toastify";

function Note(props) {
    const { deleteNote, editNote } = useNoteStore();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState(props.title);
    const [updatedContent, setUpdatedContent] = useState(props.content);

    function handleDelete() {
        deleteNote(props.id);
    }

    function handleEdit() {
        setIsEditing(true);  // Enable editing mode
    }

    function handleSave() {
        if (updatedTitle || updatedContent) {
            editNote(props.id, { title: updatedTitle, content: updatedContent });
            setIsEditing(false);  // Exit editing mode
        } else {
            toast.error("Title or content cannot be empty");
        }
    }

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                {/* Editable Title */}
                {isEditing ? (
                    <input
                        type="text"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        className="input input-bordered w-full mb-4"
                    />
                ) : (
                    <h2 className="card-title">{props.title}</h2>
                )}

                {/* Editable Content */}
                {isEditing ? (
                    <textarea
                        value={updatedContent}
                        onChange={(e) => setUpdatedContent(e.target.value)}
                        className="textarea textarea-bordered w-full mb-4"
                    />
                ) : (
                    <p>{props.content}</p>
                )}

                <div className="card-actions justify-end">
                    {isEditing ? (
                        <button className="btn btn-ghost" onClick={handleSave}>
                            Save
                        </button>
                    ) : (
                        <button className="btn btn-ghost" onClick={handleEdit}>
                            <EditIcon className="hover:cursor-pointer" />
                        </button>
                    )}
                    <button className="btn btn-ghost" onClick={handleDelete}>
                        <DeleteIcon className="hover:cursor-pointer" />
                    </button>
                </div>
                <hr />
            </div>
        </div>
    );
}

export default Note;