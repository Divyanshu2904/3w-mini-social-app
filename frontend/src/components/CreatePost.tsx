import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Image as ImageIcon, Link as LinkIcon, Send, X } from 'lucide-react';
import axios from 'axios';
import { Alert, CircularProgress } from '@mui/material';

interface CreatePostProps {
  onPostCreated: (post: any) => void;
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
  const { user, apiBaseUrl } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle local file selection and convert to Base64
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image file is too large (Max 5MB)');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result as string);
      setImageUrl(''); // Clear URL input if file is chosen
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setBase64Image(null);
    setImageUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content && !base64Image && !imageUrl) {
      setError('Post must contain either text content or an image');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const finalImageUrl = base64Image || imageUrl;
      const res = await axios.post(`${apiBaseUrl}/posts`, {
        content,
        imageUrl: finalImageUrl,
      });

      // Reset form
      setContent('');
      setBase64Image(null);
      setImageUrl('');
      setShowUrlInput(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Notify parent to add post to feed instantly
      onPostCreated(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="card-premium" style={{ textAlign: 'center', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
          Log in to write posts, upload images, and interact with the community.
        </p>
        <button className="btn-primary" onClick={() => navigate('/login')}>
          Log In / Sign Up
        </button>
      </div>
    );
  }

  return (
    <div className="card-premium" style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Create Post</h3>
      
      {error && (
        <Alert severity="error" style={{ marginBottom: '12px', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        {/* Text Input */}
        <textarea
          className="form-control"
          placeholder="What's on your mind?"
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{ resize: 'none', marginBottom: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-body)' }}
        />

        {/* URL Input Box */}
        {showUrlInput && (
          <div className="form-group" style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Paste image URL here..."
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setBase64Image(null); // Clear local file if URL is pasted
              }}
            />
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => { setShowUrlInput(false); setImageUrl(''); }}
              style={{ padding: '8px 12px' }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* Local File Input (hidden) */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        {/* Image Preview */}
        {(base64Image || imageUrl) && (
          <div style={{ position: 'relative', marginBottom: '12px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <img 
              src={base64Image || imageUrl} 
              alt="Post Preview" 
              style={{ width: '100%', maxHeight: '250px', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                // If pasted URL is invalid image
                if (imageUrl) {
                  setError('Invalid image URL');
                  e.currentTarget.style.display = 'none';
                }
              }}
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                backgroundColor: 'rgba(0,0,0,0.6)',
                border: 'none',
                color: '#fff',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>
          </div>
        )}

        {/* Action Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            {/* Upload File Icon */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
              }}
              title="Upload photo"
            >
              <ImageIcon size={20} style={{ color: 'var(--primary-color)' }} />
              <span style={{ display: 'inline' }}>Photo</span>
            </button>

            {/* Paste URL Icon */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
              }}
              title="Add Image URL"
            >
              <LinkIcon size={20} style={{ color: 'var(--yellow-primary)' }} />
              <span style={{ display: 'inline' }}>URL</span>
            </button>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '8px 16px' }}>
            {loading ? <CircularProgress size={18} color="inherit" /> : (
              <>
                <Send size={16} />
                Post
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
