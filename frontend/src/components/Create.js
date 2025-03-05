// components/Create.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000"; // Adjust to match your backend URL

function Create() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [items, setItems] = useState([
    { name: "", quantity: 1, purchased: false },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      // Create note via API
      const response = await axios.post(`${API_URL}/notes`, noteData);

      // Navigate to new note detail page if we get an ID back
      if (response.data && response.data.id) {
        navigate(`/notes/${response.data.id}`);
      } else {
        // Otherwise go to notes list
        navigate("/notes");
      }
    } catch (error) {
      console.error("Error creating note:", error);
      alert("Failed to create note. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Create Shopping Note</h1>
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
                    disabled={items.length === 1}
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
                Create Note
              </button>
            </div>
            <div className="control">
              <button
                type="button"
                className="button is-light"
                onClick={() => navigate("/notes")}
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

export default Create;
