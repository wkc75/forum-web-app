export interface Post {
  id: number;
  title: string;
  content: string;
  topicId: number;
  topicName: string;
  creatorUsername: string;
  createdAt: string;
  likesCount: number;
}
