export interface Comment {
  id: number;
  content: string;
  postId: number;
  userId: number;
  username?: string;
  createdAt?: string;
}

export interface CreateCommentRequest {
  content: string;
}
