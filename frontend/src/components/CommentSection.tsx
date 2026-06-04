import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Trash2 } from 'lucide-react';
import axios from 'axios';
import { Avatar, CircularProgress, Alert } from '@mui/material';

interface Comment {
  _id: string;
  user: string;
  username: string;
  text: string;
  createdAt: string;
}

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  onCommentsUpdated: (updatedComments: Comment[]) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, onCommentsUpdated }) => {
  const { user, apiBaseUrl } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${apiBaseUrl}/posts/${postId}/comment`, {
        text: commentText,
      });

      setCommentText('');
      // Update comments list instantly
      onCommentsUpdated(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await axios.delete(`${apiBaseUrl}/posts/${postId}/comment/${commentId}`);
      // Update comments list instantly
      onCommentsUpdated(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
      <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-main)' }}>
        Comments ({comments.length})
      </h4>

      {error && (
        <Alert severity="error" style={{ marginBottom: '12px', padding: '2px 10px', fontSize: '13px', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </Alert>
      )}

      {/* Comments List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px', maxHeight: '200px', overflowY: 'auto' }}>
        {comments.length === 0 ? (
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', padding: '6px 0' }}>
              <Avatar sx={{ bgcolor: 'var(--primary-color)', width: 26, height: 26, fontSize: '11px', fontWeight: 'bold' }}>
                {comment.username.substring(0, 2).toUpperCase()}
              </Avatar>

              <div style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.03)', padding: '8px 12px', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-main)' }}>
                    @{comment.username}
                  </span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                
                <p style={{ fontSize: '13px', color: 'var(--text-main)', lineBreak: 'anywhere' }}>
                  {comment.text}
                </p>
              </div>

              {/* Delete button (only for the comment author) */}
              {user && user._id === comment.user && (
                <button
                  onClick={() => handleDeleteComment(comment._id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '4px',
                    alignSelf: 'center',
                  }}
                  title="Delete comment"
                >
                  <Trash2 size={14} style={{ color: 'var(--danger-color)', opacity: 0.8 }} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Comment Input */}
      {user ? (
        <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '14px', borderRadius: '20px' }}
            required
          />
          <button
            type="submit"
            className="btn-primary"
            style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, minWidth: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={16} color="inherit" /> : <Send size={16} />}
          </button>
        </form>
      ) : (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '10px' }}>
          Please log in to add comments.
        </p>
      )}
    </div>
  );
};
