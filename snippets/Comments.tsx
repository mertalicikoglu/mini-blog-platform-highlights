// snippets/Comments.tsx

import React, { useEffect, useState } from 'react';
import { supabase } from '../auth/supabaseClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../auth/useAuth';

interface Comment {
  id: string;
  postId: string;
  content: string;
  user_id: string;
  created_at: string;
}

interface CommentsProps {
  postId: string;
}

const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`);
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchComments();

    // Add real-time subscription for comments
    const commentChannel = supabase
      .channel('realtime-comments')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `postId=eq.${postId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setComments((prevComments) => [...prevComments, payload.new as Comment]);
          } else if (payload.eventType === 'UPDATE') {
            setComments((prevComments) =>
              prevComments.map((comment) =>
                comment.id === (payload.new as Comment).id ? (payload.new as Comment) : comment
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setComments((prevComments) =>
              prevComments.filter((comment) => comment.id !== (payload.old as Comment).id)
            );
          }
        }
      )
      .subscribe();

    // Cleanup subscription when component unmounts
    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, [postId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({ content: newComment, postId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      setComments((prevComments) => [...prevComments, data]);
      setNewComment('');
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.access_token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: string, updatedContent: string) => {
    if (!updatedContent.trim()) {
      setError('Updated comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${postId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.access_token}`,
        },
        body: JSON.stringify({ content: updatedContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const data = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) => (comment.id === commentId ? data : comment))
      );
      setError(null);
    } catch (error) {
      setError((error as Error).message);
    }
  };

  return (
    <div className="mt-5">
      <h4 className="text-primary mb-4">Comments</h4>
      <form onSubmit={(e) => { e.preventDefault(); handleAddComment(); }} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </div>
        {error && <div className="text-danger mt-2">{error}</div>}
      </form>
      <ul className="list-group">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="list-group-item mb-3 p-3 shadow-sm bg-light rounded">
              <p className="mb-1 text-secondary">{comment.content}</p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Posted by User {comment.user_id} on {new Date(comment.created_at).toLocaleString()}</small>
                {user?.id === comment.user_id && (
                  <div>
                    <button
                      className="btn btn-sm btn-outline-danger me-2"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </button>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        const updatedContent = prompt('Edit your comment:', comment.content);
                        if (updatedContent !== null) {
                          handleUpdateComment(comment.id, updatedContent);
                        }
                      }}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="list-group-item text-center">No comments yet. Be the first to comment!</li>
        )}
      </ul>
    </div>
  );
};

export default Comments;
