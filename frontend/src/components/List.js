import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function List() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/notes");
        const formattedNotes = response.data.map((note) => {
          // Try to parse content and extract meaningful string
          let displayContent = note.content;
          try {
            const parsedContent = JSON.parse(note.content);
            // If it's an array of objects, extract a readable string
            if (Array.isArray(parsedContent)) {
              displayContent = parsedContent
                .map((item) => `${item.name || "Item"} (${item.quantity || 1})`)
                .join(", ");
            }
          } catch (e) {
            // If parsing fails, use original content
            console.log("Content parsing error:", e);
          }

          return {
            id: note.id,
            title: note.title,
            displayContent: displayContent,
            createdAt: note.createdAt || new Date().toISOString(),
          };
        });

        setNotes(formattedNotes);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please try again later.");
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`http://localhost:5000/notes/${id}`);
        setNotes(notes.filter((note) => note.id !== id));
      } catch (err) {
        console.error("Error deleting note:", err);
        alert("Failed to delete note. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="section">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section">
        <div className="container">
          <div className="notification is-danger">{error}</div>
          <button
            className="button is-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Shopping Notes</h1>
        <div className="buttons mb-5">
          <Link to="/notes/create" className="button is-primary">
            <span className="icon">
              <i className="fas fa-plus"></i>
            </span>
            <span>Add New Note</span>
          </Link>
        </div>

        {notes.length === 0 ? (
          <div className="notification is-info">
            No shopping notes yet. Create your first one!
          </div>
        ) : (
          <div className="columns is-multiline">
            {notes.map((note) => (
              <div key={note.id} className="column is-one-third">
                <div className="card">
                  <header className="card-header">
                    <p className="card-header-title">{note.title}</p>
                  </header>
                  <div className="card-content">
                    <div className="content">
                      <p className="has-text-grey">
                        {note.displayContent || "No items"}
                      </p>
                      <p className="has-text-grey is-size-7">
                        Created: {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <footer className="card-footer">
                    <Link to={`/notes/${note.id}`} className="card-footer-item">
                      View
                    </Link>
                    <Link
                      to={`/notes/${note.id}/edit`}
                      className="card-footer-item"
                    >
                      Edit
                    </Link>
                    <a
                      onClick={() => handleDelete(note.id)}
                      className="card-footer-item has-text-danger"
                      style={{ cursor: "pointer" }}
                    >
                      Delete
                    </a>
                  </footer>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default List;
