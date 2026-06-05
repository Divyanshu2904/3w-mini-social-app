import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, MessageSquare } from 'lucide-react';
import axios from 'axios';
import { Avatar } from '@mui/material';
import { CommentSection } from './CommentSection';

interface Like {
  user: string;
  username: string;
}

interface Comment {
  _id: string;
  user: string;
  username: string;
  text: string;
  createdAt: string;
}

interface Post {
  _id: string;
  user: string;
  username: string;
  content?: string;
  imageUrl?: string;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  onPostUpdated: (updatedPost: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onPostUpdated }) => {
  const { user, apiBaseUrl } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  // Check if current logged-in user liked this post
  const isLiked = user ? post.likes.some((like) => like.user === user._id) : false;

  const handleLike = async () => {
    if (!user) {
      alert('You must be logged in to like posts.');
      return;
    }
    if (likeLoading) return;

    setLikeLoading(true);
    // Optimistic UI update: Toggle like status immediately in local copy
    let updatedLikes = [...post.likes];
    const userLikeIndex = updatedLikes.findIndex((l) => l.user === user._id);
    if (userLikeIndex > -1) {
      updatedLikes.splice(userLikeIndex, 1);
    } else {
      updatedLikes.push({ user: user._id, username: user.username });
    }

    onPostUpdated({ ...post, likes: updatedLikes });

    try {
      const res = await axios.post(`${apiBaseUrl}/posts/${post._id}/like`);
      // Update actual response from server to ensure state consistency
      onPostUpdated({ ...post, likes: res.data });
    } catch (err: any) {
      console.error('Failed to like post:', err);
      // Revert optimistic update
      onPostUpdated(post);
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCommentsUpdated = (newComments: Comment[]) => {
    onPostUpdated({ ...post, comments: newComments });
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Get string of users who liked
  const likedByString = post.likes.length > 0 
    ? `Liked by: ${post.likes.map(l => `@${l.username}`).join(', ')}` 
    : 'No likes yet';

  return (
    <div className="card-premium" style={{ transition: 'var(--transition)' }}>
      {/* Post Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Avatar 
            sx={{ bgcolor: 'var(--primary-color)', width: 40, height: 40, fontSize: '15px', fontWeight: 'bold' }}
          >
            {post.username.substring(0, 1).toUpperCase()}
          </Avatar>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
              @{post.username}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {formatDate(post.createdAt)}
            </span>
          </div>
        </div>

        <button 
          style={{
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--primary-color)',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Follow
        </button>
      </div>

      {/* Post Content */}
      {post.content && (
        <p style={{
          fontSize: '15px',
          color: 'var(--text-main)',
          lineHeight: '1.6',
          marginBottom: post.imageUrl ? '12px' : '0',
          whiteSpace: 'pre-wrap',
          lineBreak: 'anywhere'
        }}>
          {post.content}
        </p>
      )}

      {/* Post Image */}
      {post.imageUrl && (
        <div style={{ borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)', margin: '8px 0' }}>
          <img 
            src={post.imageUrl} 
            alt="Post media" 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x350/1e293b/94a3b8?text=Image+Could+Not+Be+Loaded';
            }}
          />
        </div>
      )}

      {/* Post Engagement Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '14px', paddingTop: '8px' }}>
        {/* Like trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} title={likedByString}>
          <button
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              color: isLiked ? 'var(--danger-color)' : 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.1s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.85)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <Heart size={20} fill={isLiked ? 'var(--danger-color)' : 'none'} />
          </button>
          
          <span 
            style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)', cursor: 'help' }}
          >
            {post.likes.length}
          </span>
        </div>

        {/* Comment toggle trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <MessageSquare size={20} />
          </button>
          
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-muted)' }}>
            {post.comments.length}
          </span>
        </div>
      </div>

      {/* Hover usernames tooltips */}
      {post.likes.length > 0 && (
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Liked by {post.likes.map(l => `@${l.username}`).slice(0, 3).join(', ')}
          {post.likes.length > 3 ? ` and ${post.likes.length - 3} others` : ''}
        </p>
      )}

      {/* Comments Expansion Drawer */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments}
          onCommentsUpdated={handleCommentsUpdated}
        />
      )}
    </div>
  );
};
