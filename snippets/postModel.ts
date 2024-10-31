// snippets/postModel.ts

import { supabase } from '../auth/supabaseClient';

export interface Post {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export const getPosts = async (page: number, limit: number, search?: string) => {
  let query = supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .range((page - 1) * limit, page * limit - 1);

  if (search) {
    query = query.ilike('title', `%${search}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data as Post[];
};

export const createPost = async (post: Omit<Post, 'id' | 'created_at'>): Promise<Post> => {
  const { data, error } = await supabase.from('posts').insert(post).single();
  if (error) throw new Error(error.message);
  return data as Post;
};

export const updatePost = async (postId: string, updatedPost: Partial<Omit<Post, 'id' | 'created_at'>>): Promise<Post> => {
  const { data, error } = await supabase.from('posts').update(updatedPost).eq('id', postId).single();
  if (error) throw new Error(error.message);
  return data as Post;
};

export const deletePost = async (postId: string): Promise<void> => {
  const { error } = await supabase.from('posts').delete().eq('id', postId);
  if (error) throw new Error(error.message);
};
