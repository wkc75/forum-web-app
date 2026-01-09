import { useEffect, useState } from "react";
import {
  Alert,
  CircularProgress,
  Typography,
  TextField,
  Button,
  Box,
  Stack,
} from "@mui/material";

import { getTopics, createTopic, deleteTopic } from "../api/topics";
import { useAuth } from "../context/AuthContext";
import type { Topic } from "../types/topic";
import TopicCard from "../components/TopicCard";

export default function Topics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [creating, setCreating] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    setError(null);
    getTopics(search.trim() || undefined)
      .then(setTopics)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [search]);

  const handleCreate = async () => {
    if (!newTopic.trim()) return;

    try {
      setActionError(null);
      setCreating(true);
      await createTopic(newTopic.trim());
      setNewTopic("");
      setTopics(await getTopics(search.trim() || undefined));
    } catch (err: any) {
      setActionError(err.message || "Failed to create topic");
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <>
      <Typography variant="h4" gutterBottom>
        Topics
      </Typography>

      <TextField
        label="Search topics"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      {/* Create topic */}
      {user ? (
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
      ) : (
        <Typography sx={{ mb: 3 }} color="text.secondary">
          Log in to create topics.
        </Typography>
      )}

      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}

      {/* Topic list */}
      {topics.length === 0 ? (
        <Typography>No topics yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {topics.map((t) => (
            <TopicCard
              key={t.id}
              topic={t}
              showDelete={user === t.creatorUsername}
              onDelete={async () => {
                if (!window.confirm("Delete this topic?")) return;
                await deleteTopic(t.id);
                setTopics(await getTopics(search.trim() || undefined));
              }}
            />
          ))}
        </Stack>
      )}
    </>
  );
}
