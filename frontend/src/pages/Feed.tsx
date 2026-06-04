import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { CreatePost } from '../components/CreatePost';
import { PostCard } from '../components/PostCard';
import { RefreshCw } from 'lucide-react';
import { CircularProgress, Alert } from '@mui/material';

export const Feed: React.FC = () => {
  const { apiBaseUrl } = useAuth();
  
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async (pageNumber = 1, append = false) => {
    if (pageNumber === 1) {
      setLoading(true);
    } else {
      setLoadMoreLoading(true);
    }
    setError('');

    try {
      const res = await axios.get(`${apiBaseUrl}/posts?page=${pageNumber}&limit=5`);
      const { posts: newPosts, pages } = res.data;
      
      if (append) {
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      } else {
        setPosts(newPosts);
      }
      setTotalPages(pages);
      setPage(pageNumber);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
      setLoadMoreLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1, false);
  }, []);

  const handlePostCreated = (newPost: any) => {
    // Prepend newly created post to the feed instantly
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  const handlePostUpdated = (updatedPost: any) => {
    // Map over posts and replace the updated post to reflect likes/comments instantly
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post._id === updatedPost._id ? updatedPost : post))
    );
  };

  const handleLoadMore = () => {
    if (page < totalPages) {
      fetchPosts(page + 1, true);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container content-wrapper">
        {/* Pills Filter Mock from TaskPlanet */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-color)',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}>
          <button style={{
            padding: '8px 16px',
            borderRadius: '20px',
            backgroundColor: 'var(--primary-color)',
            color: '#fff',
            border: 'none',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            flexShrink: 0
          }}>
            All Posts
          </button>
          {['For You', 'Most Liked', 'Most Commented', 'Promotions'].map((pill) => (
            <button key={pill} style={{
              padding: '8px 16px',
              borderRadius: '20px',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-color)',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer',
              flexShrink: 0
            }}>
              {pill}
            </button>
          ))}
        </div>

        {/* Create Post Section */}
        <CreatePost onPostCreated={handlePostCreated} />

        {/* Error alert */}
        {error && (
          <Alert severity="error" style={{ marginBottom: '16px', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </Alert>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', margin: '40px 0' }}>
            <CircularProgress color="primary" />
          </div>
        )}

        {/* Posts List */}
        {!loading && (
          <div>
            {posts.length === 0 ? (
              <div className="card-premium" style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                <p>No posts to display. Be the first to post!</p>
              </div>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onPostUpdated={handlePostUpdated}
                />
              ))
            )}
          </div>
        )}

        {/* Load More Button */}
        {!loading && page < totalPages && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
            <button
              onClick={handleLoadMore}
              className="btn-secondary"
              disabled={loadMoreLoading}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px' }}
            >
              {loadMoreLoading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <>
                  <RefreshCw size={16} />
                  Load More Posts
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
