import React, { useState } from "react";
import { usePosts } from "../../context/PostsContext";
import { FaPlus } from "react-icons/fa"; // Added FaPlus for the "Add New Post" button

const NewPostForm = ({ isOpen, onCancel, onAdd }) => {
  const { createPost } = usePosts();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    createPost({ title, content });

    // Clear the form fields after submission
    setTitle("");
    setContent("");

    onCancel();
    onAdd();
  };

  return (
    <div className={`new-post-form ${isOpen ? "open" : ""}`}>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title" className="form-label">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
          />
        </div>
        <div>
          <label htmlFor="content" className="form-label">
            Content:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="form-textarea"
          />
        </div>
        <button onClick={onCancel} className="cancel-button">
        Cancel
      </button><button type="submit" className="form-button">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default NewPostForm;
