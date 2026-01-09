import { useEffect, useState } from "react";
import {
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";

import { getTopics, createTopic, deleteTopic } from "../api/topics";
import { getMe } from "../api/auth";
import type { Topic } from "../types/topic";

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [me, setMe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      getTopics(),
      getMe().then((u) => u.username).catch(() => null),
    ])
      .then(([topics, user]) => {
        setTopics(topics);
        setMe(user);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newTopic.trim()) return;

    try {
      setCreating(true);
      await createTopic(newTopic.trim());
      setNewTopic("");
      setTopics(await getTopics());
    } catch (err: any) {
      alert(err.message || "Failed to create topic");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Topics
      </Typography>

      {/* Create topic */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          label="New Topic"
          value={newTopic}
          onChange={(e) => setNewTopic(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleCreate}
          disabled={!newTopic.trim() || creating}
        >
          Create
        </Button>
      </Box>

      {/* Topic list */}
      {topics.length === 0 ? (
        <Typography>No topics yet.</Typography>
      ) : (
        <List>
          {topics.map((t) => (
            <ListItemButton
              key={t.id}
              component={Link}
              to={`/topic/${t.id}`}
            >
              <ListItemText
                primary={t.name}
                secondary={`by ${t.creatorUsername}`}
              />

              {me === t.creatorUsername && (
                <Button
                  color="error"
                  onClick={async (e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!window.confirm("Delete this topic?")) return;

                    await deleteTopic(t.id);
                    setTopics(await getTopics());
                }}
                >
                  Delete
                </Button>
              )}
            </ListItemButton>
          ))}
        </List>
      )}
    </>
  );
}
