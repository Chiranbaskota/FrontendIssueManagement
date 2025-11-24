export interface Post {
  id: number;
  title: string;
  description: string;
  type: PostType;
  status: PostStatus;
  userId: number;
  username?: string;
  createdAt?: string;
  updatedAt?: string;
  updateNote?: string;
}

export enum PostType {
  ISSUE = 'ISSUE',
  COMPLAINT = 'COMPLAINT',
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  LOST = 'LOST',
  HELP = 'HELP'
}

export enum PostStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CLOSED = 'CLOSED'
}

export interface CreatePostRequest {
  title: string;
  description: string;
  type: PostType;
}

export interface UpdateNoteRequest {
  updateNote: string;
}
