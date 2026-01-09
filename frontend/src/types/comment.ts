export interface Comment {
  id: number;
  content: string;
  postId: number;
  postTitle?: string;
  creatorUsername: string;
  createdAt: string;
}
