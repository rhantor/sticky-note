import React, { useEffect, useReducer, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";

// time
const dateFormate = new Intl.DateTimeFormat("en-US", {
  hour12: true,
  hour: "numeric",
  minute: "numeric",
  day: "2-digit",
  month: "short",
  year: "2-digit",
  weekday: "short",
});
const initialNoteState = {
  lastUpDateTime: null,
  totalNotes: 0,
  notes: [],
};
const date = new Date();
const notesReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTE": {
      const newState = {
        lastUpDateTime: dateFormate.format(date),
        totalNotes: state.notes.length + 1,
        notes: [...state.notes, action.item],
      };
      return newState;
    }

    case "DELETE_NOTE":
      const newState = {
        ...state,
        totalNotes: state.notes.length - 1,
        notes: state.notes.filter((note) => note.id !== action.item.id),
      };
      return newState;
    default:
      return state;
  }
};
const dragFunc = (event) => {
  event.target.style.left = `${event.pageX - 50}px`;
  event.target.style.top = `${event.pageY - 50}px`;
};
const dragOver = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

export default function App() {
  const [input, setInput] = useState();
  const [state, dispatch] = useReducer(
    notesReducer,
    initialNoteState,
    (initial) => JSON.parse(localStorage.getItem("state")) || initial
  );

  useEffect(() => {
    localStorage.setItem("state", JSON.stringify(state));
  }, [state]);

  function submitFunc(event) {
    event.preventDefault();

    if (!input) {
      return null;
    }

    const newNote = {
      id: Math.floor(Math.random() * 1000000),
      text: input,
      rotate: Math.floor(Math.random() * 20),
    };
    dispatch({
      type: "ADD_NOTE",
      item: newNote,
    });

    setInput("");
  }
  return (
    <div className="app" onDragOver={dragOver}>
      <h1>
        
        Sticky Note (<span>{state.notes.length}</span>)
        {state && (
          <span className="time">
            last update time : {state.lastUpDateTime}
          </span>
        )}
      </h1>

      <form onSubmit={submitFunc} className="noteForm">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add new note..."
        ></textarea>
        <button>Add</button>
      </form>

      {state
        ? state.notes.map((note) => (
            <div
              className="sticky-note"
              key={note.id}
              style={{ transform: `rotate(${note.rotate}deg)` }}
              draggable="true"
              onDragEnd={dragFunc}
            >
              <IconButton
                aria-label="cancel"
                size="small"
                className="dlt-icon"
                onClick={() => {
                  dispatch({
                    type: "DELETE_NOTE",
                    item: note,
                  });
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>

              <p className="text">{note.text} </p>
            </div>
          ))
        : "nothing"}
    </div>
  );
}
