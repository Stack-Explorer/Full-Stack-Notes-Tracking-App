import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import Zoom from "@mui/material/Zoom";
import { toast } from "react-toastify";

const CreateArea = (props) => {
  const [isExpanded, setExpanded] = useState(false);

  const [note, setNote] = useState({
    title: "",
    content: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setNote((prevNote) => {
      return {
        ...prevNote,
        [name]: value,
      };
    });
  }

  function submitNote(event) {
    if (note.title.trim() || note.content.trim()) {
      props.onAdd(note);
      setNote({
        title: "",
        content: "",
      });
    } else {
      toast.error("Title or Content cannot be empty.");
    }
    event.preventDefault();
  }

  function expand() {
    setExpanded(true);
  }

  function handleClickOutside(event) {
    if (event.target.closest(".create-note") === null) {
      setExpanded(false);
    }
  }

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div className="bg-base-200 p-6 rounded-lg shadow-lg">
      <form className="create-note">
        {isExpanded && (
          <input
            name="title"
            onChange={handleChange}
            value={note.title}
            placeholder="Title"
            className="input input-bordered w-full mb-4"
          />
        )}
        <textarea
          name="content"
          onClick={expand}
          onChange={handleChange}
          value={note.content}
          placeholder="Take a Note..."
          rows={isExpanded ? 3 : 1}
          className="textarea textarea-bordered w-full mb-4"
        />
        <Zoom in={isExpanded}>
          <Fab onClick={submitNote} className="bg-primary text-white">
            <AddIcon />
          </Fab>
        </Zoom>
      </form>
    </div>
  );
};

export default CreateArea;