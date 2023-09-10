// PostsContext.js
import React, { useContext, useState, useEffect } from "react";

const PostsContext = React.createContext();

export const usePosts = () => {
  return useContext(PostsContext);
};

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching blogs:", error);
        setLoading(false); // Set loading to false on error
      });
  }, []);

  // Function to fetch comments by postId
  async function fetchCommentsByPostId(postId) {
    try {
      const response = await fetch(`/api/post-comment/${postId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      // Handle the error gracefully, e.g., display an error message to the user.
    }
  }

  //Post Comment
  function postComment(emailAddress, liked, postId, commentText) {
    fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: emailAddress,
        like: liked, // Include the liked status
        post_id: postId,
        content: commentText,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json(); // Parse the response JSON
        }
        throw new Error("Failed to post comment");
      })
      .then((newComment) => {
        // Append the new comment to the existing comments state
        setComments((prevComments) => [...prevComments, newComment]);
      })
      .catch((error) => {
        console.error("Error posting comment:", error);
      });
  }

  // Function to edit a comment
const patchComment = async (commentId, updatedData) => {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error('Failed to update comment');
    }

    const updatedComment = await response.json();

    // Update the comments state with the updated comment
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  } catch (error) {
    console.error('Error updating comment:', error);
    // Handle the error gracefully, e.g., display an error message to the user.
  }
};

  //Delete Comment
  function deleteComment(commentId) {
    fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Remove the deleted comment from the comments state
          setComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
          );
        } else {
          throw new Error("Failed to delete comment");
        }
      })
      .catch((error) => {
        console.error("Error deleting comment:", error);
      });
  }
  //Get Comment by postId

  const contextValue = {
    comments,
    setComments,  
    posts,
    loading,
    postComment,
    deleteComment,
    patchComment,
    fetchCommentsByPostId,
  };

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

export default PostsProvider;
