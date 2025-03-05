// components/List.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Make sure to install axios

function List() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch notes from the backend API
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/notes");
        // Transform the data to match the expected format in your component
        const formattedNotes = response.data.map((note) => {
          let items = [];
          try {
            // Try to parse the content as JSON (if it contains items)
            items = JSON.parse(note.content);
          } catch (e) {
            // If content is not valid JSON, just use it as a string
            console.log("Content is not valid JSON:", e);
          }

          return {
            id: note.id,
            title: note.title,
            content: note.content,
            items: Array.isArray(items) ? items : [],
            createdAt: note.createdAt || new Date().toISOString(),
            updatedAt: note.updatedAt || new Date().toISOString(),
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
        // Delete note through the API
        await axios.delete(`http://localhost:5000/notes/${id}`);
        // Update the UI by removing the deleted note
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
                        {note.items ? `${note.content}` : "No items"}
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
