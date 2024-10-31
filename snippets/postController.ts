// snippets/postController.ts

import { Request, Response, NextFunction } from 'express';
import * as postModel from '../models/postModel';

export const getPosts = async (req: Request, res: Response, next: NextFunction) => {
  const { page = 1, limit = 10, search } = req.query;
  try {
    const posts = await postModel.getPosts(Number(page), Number(limit), search as string);
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = {
      title: req.body.title,
      content: req.body.content,
      user_id: req.user!.id,
    };
    const newPost = await postModel.createPost(validatedData);
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;
    const updatedPost = req.body;
    const post = await postModel.updatePost(postId, updatedPost);
    res.json(post);
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const postId = req.params.id;
    await postModel.deletePost(postId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
