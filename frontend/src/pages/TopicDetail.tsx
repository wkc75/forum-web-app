import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

import { getPostsByTopic } from "../api/posts";
import type { Post } from "../types/post";

export default function TopicDetail() {
  const { id } = useParams();
  const topicId = Number(id);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getPostsByTopic(topicId)
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [topicId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Posts
      </Typography>

      {posts.length === 0 ? (
        <Typography>No posts yet.</Typography>
      ) : (
        <List>
          {posts.map((p) => (
            <ListItemButton
              key={p.id}
              component={Link}
              to={`/post/${p.id}`}
            >
              <ListItemText
                primary={p.title}
                secondary={`by ${p.creatorUsername}`}
              />
            </ListItemButton>
          ))}
        </List>
      )}
    </>
  );
}
