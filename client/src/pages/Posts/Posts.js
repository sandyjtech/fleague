import React, { useState, useEffect } from 'react';
import './Posts.css'; // Import the CSS file
import { FaTrash, FaPencilAlt } from 'react-icons/fa';
import { usePosts } from '../../context/PostsContext';
import { Link } from 'react-router-dom';
import SearchBar from "../../components/SearchBar";
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

const Posts = () => {  
const [searchQuery, setSearchQuery] = useState("");
const { posts, postComment, comments, setComments, fetchCommentsByPostId,  deleteComment, patchComment } = usePosts();

  // State for managing likes
  const [likes, setLikes] = useState({});
  
  // State to track the visibility of the comment section for each post
  const [commentSectionVisibility, setCommentSectionVisibility] = useState({});
  
  // State to track the comment being edited
  const [editingComment, setEditingComment] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState(""); 

  // Function to add a new comment
  const addComment = (emailAddress, liked, postId, commentText) => {
    postComment(emailAddress, liked, postId, commentText);
  };

  // Function to handle liking a comment
  const handleLike = (commentId) => {
    // Toggle like status for the given comment
    const newLikes = { ...likes };
    newLikes[commentId] = !newLikes[commentId];
    setLikes(newLikes);
  };
  // Function to delete a comment
  const editComment = (commentId, newText) => {
    const updatedData = {
      content: newText,
    };
  
    patchComment(commentId, updatedData);
  };
  // Function to delete a comment
  const removeComment = (commentId) => {
    deleteComment(commentId);
  };;

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
    if (commentToEdit) {
      setEditingComment(commentId);
      setEditedCommentText(commentToEdit.content); // Update with the comment content
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
    <>
    <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

    <div className="posts-container">
      {posts.map((post) => (
        <div key={post.id} className="post">
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
            >
              {commentSectionVisibility[post.id] ? "Hide Comments" : "Comments"}
            </button>
            
            {/* Show comments only if the comment section is visible */}
            {commentSectionVisibility[post.id] && (
              
              <ul>
                {comments
                  .filter((comment) => comment.post_id === post.id) // Use 'post_id' to filter comments
                  .map((comment) => (
                    <li key={comment.id} className="comment">
                      <div className="comment-content">
                      
                        {editingComment === comment.id ? (
                          <>
                            <textarea
                              value={editedCommentText}
                              onChange={(e) =>
                                setEditedCommentText(e.target.value)
                              }
                            />
                            <button
                              onClick={() =>{
                                saveEditedComment(comment.id, editedCommentText);
                                editComment(comment.id, editedCommentText);
                              }
                              }
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <p>{comment.content}</p>
                        )}
                        <span className="like-count">
                          {likes[comment.id] || <FaThumbsUp />}
                        </span>
                      </div>
                      <div className="comment-buttons">
                        <button onClick={() => removeComment(comment.id)}>
                          <FaTrash />
                        </button>
                        <button onClick={() => handleLike(comment.id)}>
                          {likes[comment.id] ? <FaThumbsUp /> : <FaThumbsDown />}
                        </button>
                        <button onClick={() => startEditComment(comment.id)}>
                          <FaPencilAlt />
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
            


            {/* // Filter the stats based on the searchQuery
    const filteredStats = stats.filter((stat) => {
      const query = searchQuery.toLowerCase();
      const description = stat.description.toLowerCase();
      return query === "" || description.includes(query);
    });

    return (
      <div key={categoryTitle}>
        <h1 className="title">{categoryTitle}</h1>
        <div className="stat-card-container">
          {filteredStats.map((stat) => (
            <HomeItem key={stat.name} {...stat} />
          ))}
        </div>
      </div>
    );
  }; */}




            {/* Add a Comment form */}
            {commentSectionVisibility[post.id] && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const commentText = e.target.commentText.value;
                  const emailAddress = e.target.emailAddress.value;
                  const liked = true; // Adjust this based on your logic
                  addComment(emailAddress, liked, post.id, commentText); // Pass the liked status
                  e.target.commentText.value = ""; // Clear the input field
                }}
              >
                <input
                  type="text"
                  name="emailAddress"
                  placeholder="Email Address"
                  className="comment-input"
                />
                <input
                  type="text"
                  name="commentText"
                  placeholder="Add a comment"
                  className="comment-input"
                />
                <button type="submit" className="comment-button">
                  Add Comment
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
    </>
  );
};

export default Posts;