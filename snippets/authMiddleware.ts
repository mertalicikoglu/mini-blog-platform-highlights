// snippets/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { supabase } from '../auth/supabaseClient';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = data.user;
  next();
};
