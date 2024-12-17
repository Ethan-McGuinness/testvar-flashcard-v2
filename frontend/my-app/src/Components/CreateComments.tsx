import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../Components/CreateComments.css'
import { jwtDecode } from 'jwt-decode';


interface Comment {
  id: number;
  comment: string;
  authorId: number;
  setId: number;
  createdAt: string;
  updatedAt: string;
  author: {
    username: string;
  };
}

interface CommentsPopupProps {
  setId: number;
  onClose: () => void;
}

const CommentsPopup: React.FC<CommentsPopupProps> = ({ setId, onClose }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorId, setAuthorId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        setAuthorId(decodedToken.userId);
      } catch (error) {
        console.error("Failed to decode and fetch the users id", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/sets/${setId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();
  }, [setId]);

  const handleAddComment = async () => {
    if (!newComment || authorId === null) {
      return;
    }

    try {
      const response = await axios.post(`/sets/${setId}/comments`, {
        comment: newComment,
        authorId: authorId,
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!authorId) {
      console.error("User ID not found");
      return;
    }
  
    try {
      await axios.delete(`/comments/${commentId}`, {
        data: { userId: authorId }, // Send userId in the request body
      });
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
      setErrorMessage('You are not authorized to delete this comment.');
    }
  };
  

  return (
    <div className="comments-popup">
      <div className="comments-popup-content">
        <button className="close-button" onClick={onClose}>Close</button>
        <div className="add-comment">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
          />
          <button onClick={handleAddComment}>Post</button>
        </div>
        <div className="comments-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment">
              <p><strong>{comment.author?.username}</strong>: {comment.comment}</p>
              <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            </div>
          ))}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default CommentsPopup;
