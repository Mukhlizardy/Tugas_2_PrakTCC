// components/Detail.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000"; // Adjust to match your backend URL

function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${API_URL}/notes/${id}`);
        const noteData = response.data;

        setNote(noteData);

        // Attempt to parse content as JSON for items
        try {
          const parsedItems = JSON.parse(noteData.content);
          if (Array.isArray(parsedItems)) {
            setItems(parsedItems);
          }
        } catch (e) {
          // Content is not JSON, leave items as empty array
          console.log("Note content is not JSON format");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        alert("Failed to load note details");
        navigate("/notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`${API_URL}/notes/${id}`);
        navigate("/notes");
      } catch (error) {
        console.error("Error deleting note:", error);
        alert("Failed to delete note");
      }
    }
  };

  const toggleItemPurchased = async (index) => {
    try {
      const updatedItems = [...items];
      updatedItems[index].purchased = !updatedItems[index].purchased;
      setItems(updatedItems);

      // Update note in the backend
      await axios.patch(`${API_URL}/notes/${id}`, {
        content: JSON.stringify(updatedItems),
      });
    } catch (error) {
      console.error("Error updating item status:", error);
      alert("Failed to update item status");
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

  if (!note) {
    return (
      <div className="section">
        <div className="container">
          <p>Note not found</p>
          <Link to="/notes" className="button is-primary">
            Back to Notes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="columns">
          <div className="column">
            <h1 className="title">{note.title}</h1>
          </div>
          <div className="column is-narrow">
            <div className="buttons">
              <Link to={`/notes/${id}/edit`} className="button is-info">
                <span className="icon">
                  <i className="fas fa-edit"></i>
                </span>
                <span>Edit</span>
              </Link>
              <button onClick={handleDelete} className="button is-danger">
                <span className="icon">
                  <i className="fas fa-trash"></i>
                </span>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="box">
            <h2 className="subtitle">Shopping Items</h2>
            <table className="table is-fullwidth">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Item</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr
                    key={index}
                    className={item.purchased ? "has-background-light" : ""}
                  >
                    <td>
                      <label className="checkbox">
                        <input
                          type="checkbox"
                          checked={item.purchased}
                          onChange={() => toggleItemPurchased(index)}
                        />
                      </label>
                    </td>
                    <td>
                      <span
                        className={
                          item.purchased ? "has-text-grey is-italic" : ""
                        }
                      >
                        {item.name}
                      </span>
                    </td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="notification is-info">
            <p>This note doesn't have any shopping items.</p>
          </div>
        )}

        <Link to="/notes" className="button mt-4">
          Back to Notes
        </Link>
      </div>
    </div>
  );
}

export default Detail;
