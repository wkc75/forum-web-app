import { useEffect, useState } from "react";
import {
  Alert,
  TextField,
  Button,
  Typography,
  MenuItem,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/posts";
import { getTopics } from "../api/topics";
import { useAuth } from "../context/AuthContext";
import type { Topic } from "../types/topic";

export default function NewPost() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    getTopics().then((t) => {
      setTopics(t);
      if (t.length > 0) {
        setTopicId(t[0].id);
      }
    });
  }, []);

  const submit = async () => {
    if (!title.trim() || !content.trim() || topicId === null) return;

    try {
      setError(null);
      setCreating(true);
      const response = await createPost(title.trim(), content.trim(), topicId);
      setTitle("");
      setContent("");
      navigate(`/post/${response.id}`);
    } catch (e: any) {
      setError(e.message || "Failed to create post. Are you logged in?");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        New Post
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : !user ? (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Log in to create a post.
        </Typography>
      ) : null}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Title"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={!user}
      />

      <TextField
        label="Content"
        fullWidth
        multiline
        minRows={4}
        sx={{ mb: 2 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={!user}
      />

      <TextField
        select
        label="Topic"
        fullWidth
        sx={{ mb: 2 }}
        value={topicId ?? ""}
        onChange={(e) => setTopicId(Number(e.target.value))}
        disabled={!user || topics.length === 0}
      >
        {topics.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.name}
          </MenuItem>
        ))}
      </TextField>

      {topics.length === 0 && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Create a topic before posting.
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={submit}
        disabled={
          creating ||
          !user ||
          !title.trim() ||
          !content.trim() ||
          topicId === null
        }
      >
        Create
      </Button>
    </Box>
  );
}
