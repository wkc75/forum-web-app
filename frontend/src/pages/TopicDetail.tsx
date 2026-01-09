import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import { getPostsByTopic } from "../api/posts";
import { getTopic } from "../api/topics";
import PostCard from "../components/PostCard";
import type { Post } from "../types/post";
import type { Topic } from "../types/topic";
import { formatDate } from "../utils/format";

export default function TopicDetail() {
  const { id } = useParams();
  const topicId = Number(id);

  const [topic, setTopic] = useState<Topic | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (Number.isNaN(topicId)) {
      setError("Invalid topic.");
      setLoading(false);
      return;
    }
    Promise.all([getTopic(topicId), getPostsByTopic(topicId)])
      .then(([topic, posts]) => {
        setTopic(topic);
        setPosts(posts);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!topic) return <Typography>Topic not found.</Typography>;

  return (
    <>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography variant="h4">{topic.name}</Typography>
        <Typography color="text.secondary">
          by {topic.creatorUsername} · {formatDate(topic.createdAt)}
        </Typography>
      </Stack>

      {posts.length === 0 ? (
        <Typography color="text.secondary">
          This topic has no posts yet.
        </Typography>
      ) : (
        <Stack spacing={2}>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </Stack>
      )}
    </>
  );
}
