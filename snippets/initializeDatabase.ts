// snippets/initializeDatabase.ts

import { supabase } from './auth/supabaseClient';

export const initializeDatabase = async () => {
  const { error: postError } = await supabase.rpc('create_posts_table');
  if (postError) {
    console.error(`Error creating posts table: ${postError.message}`);
  }

  const { error: commentError } = await supabase.rpc('create_comments_table');
  if (commentError) {
    console.error(`Error creating comments table: ${commentError.message}`);
  }
};
