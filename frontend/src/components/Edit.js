// components/Edit.js - Updated with backend API integration
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios"; // You'll need to install axios: npm install axios

// Set base URL for API requests
const API_URL = "http://localhost:5000"; // Adjust this to match your backend URL

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Fetch note data from backend API
    const fetchNote = async () => {
      try {
        const response = await axios.get(`${API_URL}/notes/${id}`);
        const note = response.data;

        if (note) {
          setTitle(note.title);

          // Parse items from content if it's JSON string
          try {
            const parsedItems = JSON.parse(note.content);
            if (Array.isArray(parsedItems)) {
              setItems(parsedItems);
            } else {
              // If content is not an array, initialize with empty array
              setItems([]);
              // Keep the content as is
              setContent(note.content);
            }
          } catch (e) {
            // If content is not valid JSON, treat it as plain text
            setContent(note.content || "");
            setItems([]);
          }
        } else {
          alert("Note not found!");
          navigate("/notes");
        }
      } catch (error) {
        console.error("Error fetching note:", error);
        alert("Failed to load note. Please try again.");
        navigate("/notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id, navigate]);

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, purchased: false }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!title.trim()) {
      alert("Please enter a title");
      setIsSubmitting(false);
      return;
    }

    try {
      // Filter out empty items
      const validItems = items.filter((item) => item.name.trim() !== "");

      // Prepare note data for API
      const noteData = {
        title: title.trim(),
        // Store items array as JSON string in content field
        content: JSON.stringify(validItems),
      };

      // Update note via API
      await axios.patch(`${API_URL}/notes/${id}`, noteData);

      // Navigate back to detail view
      navigate(`/notes/${id}`);
    } catch (error) {
      console.error("Error updating note:", error);
      alert("Failed to update note. Please try again.");
      setIsSubmitting(false);
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

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Edit Shopping Note</h1>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Title</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Shopping List Title"
                required
              />
            </div>
          </div>

          <div className="box">
            <h2 className="subtitle">Items</h2>
            {items.map((item, index) => (
              <div key={index} className="field is-grouped mb-4">
                <div className="control is-expanded">
                  <input
                    className="input"
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    placeholder="Item name"
                  />
                </div>
                <div className="control" style={{ width: "100px" }}>
                  <input
                    className="input"
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        parseInt(e.target.value)
                      )
                    }
                  />
                </div>
                <div className="control">
                  <label className="checkbox mt-2">
                    <input
                      type="checkbox"
                      checked={item.purchased}
                      onChange={(e) =>
                        handleItemChange(index, "purchased", e.target.checked)
                      }
                    />
                    &nbsp;Purchased
                  </label>
                </div>
                <div className="control">
                  <button
                    type="button"
                    className="button is-danger"
                    onClick={() => handleRemoveItem(index)}
                  >
                    <span className="icon">
                      <i className="fas fa-trash"></i>
                    </span>
                  </button>
                </div>
              </div>
            ))}
            <div className="control">
              <button
                type="button"
                className="button is-info"
                onClick={handleAddItem}
              >
                <span className="icon">
                  <i className="fas fa-plus"></i>
                </span>
                <span>Add Item</span>
              </button>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className={`button is-primary ${
                  isSubmitting ? "is-loading" : ""
                }`}
                disabled={isSubmitting}
              >
                Save Changes
              </button>
            </div>
            <div className="control">
              <button
                type="button"
                className="button is-light"
                onClick={() => navigate(`/notes/${id}`)}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit;
