// PostsContext.js
import React, { useContext, useState, useEffect } from "react";
import {useUserAuth} from "./UserAuthProvider";

const PostsContext = React.createContext();
export const usePosts = () => {
  return useContext(PostsContext);
};

const PostsProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
const {user} = useUserAuth()
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
        console.error("Error fetching posts:", error);
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
//Create Post// Function to create a new post
function createPost(postData) {
  // Set default values if postData is not provided
  const defaultPostData = {
    title: "",
    content: "",
    user_id: user.id, 
  };

  // Merge the default values with the provided postData (if any)
  const mergedPostData = { ...defaultPostData, ...postData };

  fetch("/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mergedPostData),
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
      throw new Error("Failed to create post");
    })
    .then((newPost) => {
      // Append the new post to the existing posts state
      setPosts((prevPosts) => [...prevPosts, newPost]);
    })
    .catch((error) => {
      console.error("Error creating post:", error);
    });
}
  //Delete the post
  function deletePost(postId) {
    fetch(`/api/post/${postId}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Remove the deleted post from the posts state
          setPosts((prevPosts) =>
            prevPosts.filter((post) => post.id !== postId)
          );
        } else {
          throw new Error("Failed to delete post");
        }
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  }
  //Update the post
  async function updatePost(postId, updatedData) {
    try {
      const response = await fetch(`/api/post/${postId}`, {
        method: "PATCH", // Use the PATCH HTTP method for updating the resource
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update post");
      }
  
      const updatedPost = await response.json();
  
      // Update the posts state with the updated post
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === updatedPost.id ? updatedPost : post
        )
      );
    } catch (error) {
      console.error("Error updating post:", error);
      // Handle the error gracefully, e.g., display an error message to the user.
    }
  }
  //Post Comment
  function postComment( userId, postId, commentText) {
    fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,      
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
    createPost,
    deletePost,
    updatePost
  };

  return (
    <PostsContext.Provider value={contextValue}>
      {children}
    </PostsContext.Provider>
  );
};

export default PostsProvider;
