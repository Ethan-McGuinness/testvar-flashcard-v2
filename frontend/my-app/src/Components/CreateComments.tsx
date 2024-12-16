import React, { useState, useEffect } from 'react';
import axios from 'axios';


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
    if (!newComment) {
      return;
    }

    try {
      const response = await axios.post(`/sets/${setId}/comments`, {
        comment: newComment,
        authorId: 1, // Replace with actual user ID
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`/comments/${commentId}`);
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
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
              <p><strong>{comment.author.username}</strong>: {comment.comment}</p>
              <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommentsPopup;
