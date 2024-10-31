// snippets/CreatePost.tsx

import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { postSchema } from '../utils/validation';
import { z } from 'zod';

const createPost = async (newPost: { title: string; content: string }) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${user?.access_token}`, // Authentication using access_token
    },
    body: JSON.stringify(newPost),
  });

  if (!response.ok) {
    throw new Error('Failed to create post');
  }

  return await response.json();
};

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null); // User messages for feedback
  const queryClient = useQueryClient();

  const mutation = useMutation(createPost, {
    onSuccess: () => {
      // Invalidate 'posts' query to refetch updated post list
      queryClient.invalidateQueries('posts');
      setTitle('');
      setContent('');
      setMessage('Post created successfully!');
    },
    onError: (error: any) => {
      setMessage('Failed to create post: ' + error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form data using Zod schema
      const validatedData = postSchema.parse({ title, content });
      mutation.mutate(validatedData);
      setErrors([]);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.errors.map((err) => err.message));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mt-4">
      <h2>Create Post</h2>
      <input
        type="text"
        placeholder="Title"
        className="form-control my-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Content"
        className="form-control my-2"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" disabled={mutation.isLoading} className="btn btn-primary">
        {mutation.isLoading ? 'Submitting...' : 'Submit'}
      </button>
      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((error, index) => (
            <p key={index}>{error}</p>
          ))}
        </div>
      )}
      {message && (
        <div style={{ color: message.includes('successfully') ? 'green' : 'red' }}>{message}</div>
      )}
    </form>
  );
};

export default CreatePost;
