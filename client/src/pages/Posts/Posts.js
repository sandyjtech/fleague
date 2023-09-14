import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Posts.css";
import {
  FaTrash,
  FaPencilAlt,
  FaThumbsUp,
  FaThumbsDown,
  FaPlus,
} from "react-icons/fa"; 
import { usePosts } from "../../context/PostsContext";
import NewPostForm from "./NewPostForm";
import { useUserAuth } from "../../context/UserAuthProvider";

const Posts = () => {
  const {
    posts,
    postComment,
    comments,
    setComments,
    fetchCommentsByPostId,
    deleteComment,
    patchComment,
    updatePost,
    createPost,
    deletePost,
  } = usePosts();
  const { user } = useUserAuth();
  const [likes, setLikes] = useState({});
  const [commentSectionVisibility, setCommentSectionVisibility] = useState({});

  // State to track the comment being edited
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editedPostText, setEditedPostText] = useState("");
  const [isAddingNewPost, setIsAddingNewPost] = useState(false);
  const toggleNewPostForm = () => {
    setIsAddingNewPost(!isAddingNewPost);
  };
  // Function to start editing a post
  const startEditPost = (postId) => {
    console.log("Editing post with ID:", postId);
    const postToEdit = posts.find((post) => post.id === postId);
    if (postToEdit) {
      setEditingPost(postId);
      setEditedPostText(postToEdit.content); // Update with the post content
    } else {
      console.error("Post not found.");
    }
  };

  // Function to save the edited post
  const saveEditedPost = (postId, newText) => {
    updatePost(postId, { content: newText });
    setEditingPost(null);
    setEditedPostText("");
  };

  // Function to cancel editing a post
  const cancelEditPost = () => {
    setEditingPost(null);
    setEditedPostText("");
  };

  // Function to add a new comment
  const addComment = (userId, postId, commentText) => {
    postComment(userId, postId, commentText);
  };

  // Function to handle liking a comment
  const handleLike = (commentId) => {
    const newLikes = { ...likes };
    newLikes[commentId] = !newLikes[commentId];
    setLikes(newLikes);
  };

  // Function to delete a comment
  const removeComment = (commentId) => {
    const commentToDelete = comments.find(
      (comment) => comment.id === commentId
    );
    if (commentToDelete && commentToDelete.user_id === user.id) {
      deleteComment(commentId);
    } else {
      console.error("You are not authorized to delete this comment.");
    }
  };

  // Function to edit a comment
  const editComment = (commentId, newText) => {
    const updatedData = {
      content: newText,
    };

    patchComment(commentId, updatedData);
  };

  // Function to toggle the comment section visibility for a specific post
  const toggleCommentSection = (postId) => {
    setCommentSectionVisibility((prevVisibility) => ({
      ...prevVisibility,
      [postId]: !prevVisibility[postId],
    }));
  };

  // Function to set the comment being edited
  const startEditComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);
    if (commentToEdit && commentToEdit.user_id === user.id) {
      // Check if the comment exists and is created by the logged-in user
      setEditingComment(commentId);
      setEditedCommentText(commentToEdit.content); // Update with the comment content
    } else {
      console.error("You are not authorized to edit this comment.");
      // Handle unauthorized editing (e.g., display an error message).
    }
  };

  // Function to save the edited comment
  const saveEditedComment = (commentId, newText) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === commentId) {
        return { ...comment, content: newText }; // Update the content field
      }
      return comment;
    });

    setComments(updatedComments);
    setEditingComment(null);
    setEditedCommentText("");
  };

  // Use useEffect to fetch comments only when posts change or when posting a new comment
  useEffect(() => {
    posts.forEach((post) => {
      // Fetch comments only if the comment section is visible for this post
      if (commentSectionVisibility[post.id]) {
        fetchCommentsByPostId(post.id);
      }
    });
  }, [posts, fetchCommentsByPostId, commentSectionVisibility]);

  return (
    <div className="posts-container" style={{ backgroundColor: "#333" }}>
      <button
        onClick={() => toggleNewPostForm()} 
        className="add-post-button"
      >
        <FaPlus /> Add New Post
      </button>
      <NewPostForm
        isOpen={isAddingNewPost} 
        onCancel={() => toggleNewPostForm()} 
        onAdd={() => createPost} 
      />
      {posts.map((post) => (
        <div key={post.id} className="post">
          {/* Display the post's author */}
          <p>Author: {post.user ? post.user.username : "Unknown"}</p>
          {/* Edit and Delete buttons for each post */}
          {editingPost === post.id ? (
            <>
              <textarea
                value={editedPostText}
                onChange={(e) => setEditedPostText(e.target.value)}
              />
              <button
                onClick={() => saveEditedPost(post.id, editedPostText)}
                style={{ backgroundColor: "#142e60", color: "#fff" }}
              >
                Save
              </button>
              <button
                onClick={() => cancelEditPost()}
                style={{ backgroundColor: "#142e60", color: "#fff" }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => startEditPost(post.id)}
                style={{ backgroundColor: "#142e60", color: "#fff" }}
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post.id)}
                style={{ backgroundColor: "#142e60", color: "#fff" }}
              ></button>
            </>
          )}
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <Link to={post.link} target="_blank">
            Read More
          </Link>

          {/* Comment section */}
          <div className="comment-section">
            {/* Button to toggle comment section */}
            <button
              onClick={() => toggleCommentSection(post.id)}
              className="comment-toggle-button"
              style={{ backgroundColor: "#142e60", color: "#fff" }}
            >
              {commentSectionVisibility[post.id] ? "Hide Comments" : "Comments"}
            </button>

            {/* Show comments only if the comment section is visible */}
            {commentSectionVisibility[post.id] && (
              <ul>
                {comments
                  .filter((comment) => comment.post_id === post.id)
                  .map((comment) => (
                    <li key={comment.id} className="comment">
                      {/* Display the comment's author */}
                      <p>Author: {comment.user.username}</p>
                      <div className="comment-content">
                        {editingComment === comment.id ? (
                          <>
                            <textarea
                              value={editedCommentText}
                              onChange={(e) =>
                                setEditedCommentText(e.target.value)
                              }
                              className="comment-input"
                            />
                            <button
                              onClick={() => {
                                saveEditedComment(
                                  comment.id,
                                  editedCommentText
                                );
                                editComment(comment.id, editedCommentText);
                              }}
                              className="comment-button"
                              style={{
                                backgroundColor: "#142e60",
                                color: "#fff",
                              }}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <p>{comment.content}</p>
                        )}
                        <span className="like-count">
                          {likes[comment.id] ? (
                            <FaThumbsUp style={{ color: "limegreen" }} />
                          ) : (
                            <FaThumbsDown style={{ color: "lightblue" }} />
                          )}
                        </span>
                      </div>
                      <div className="comment-buttons">
                        <button
                          onClick={() => removeComment(comment.id)}
                          style={{ backgroundColor: "#142e60", color: "#fff" }}
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleLike(comment.id)}
                          style={{ backgroundColor: "#142e60", color: "#fff" }}
                        >
                          {likes[comment.id] ? (
                            <FaThumbsUp />
                          ) : (
                            <FaThumbsDown />
                          )}
                        </button>
                        <button
                          onClick={() => startEditComment(comment.id)}
                          style={{ backgroundColor: "#142e60", color: "#fff" }}
                        >
                          <FaPencilAlt />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}

            {/* Add a Comment form */}
            {commentSectionVisibility[post.id] && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const commentText = e.target.commentText.value;
                  const userId = user.id;
                  addComment(userId, post.id, commentText); // Pass the liked status
                  e.target.commentText.value = ""; // Clear the input field
                }}
              >
                <input
                  type="text"
                  name="commentText"
                  placeholder="Add a comment"
                  className="comment-input"
                />
                <button
                  type="submit"
                  className="comment-button"
                  style={{ backgroundColor: "#142e60", color: "#fff" }}
                >
                  Add Comment
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Posts;
