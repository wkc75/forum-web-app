import { useEffect, useState } from "react";
import { TextField, Button, Typography, MenuItem, Box } from "@mui/material";
import { createPost } from "../api/posts";
import { getTopics } from "../api/topics";
import type { Topic } from "../types/topic";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicId, setTopicId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

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
      setCreating(true);
      await createPost(title.trim(), content.trim(), topicId);
      setTitle("");
      setContent("");
      alert("Post created");
    } catch (e: any) {
      alert(e.message || "Failed to create post. Are you logged in?");
    } finally {
      setCreating(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        New Post
      </Typography>

      <TextField
        label="Title"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Content"
        fullWidth
        multiline
        minRows={4}
        sx={{ mb: 2 }}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <TextField
        select
        label="Topic"
        fullWidth
        sx={{ mb: 2 }}
        value={topicId ?? ""}
        onChange={(e) => setTopicId(Number(e.target.value))}
        disabled={topics.length === 0}
      >
        {topics.map((t) => (
          <MenuItem key={t.id} value={t.id}>
            {t.name}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        onClick={submit}
        disabled={
          creating ||
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
