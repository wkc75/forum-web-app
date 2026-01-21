import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { getHealth, type HealthResponse } from "../api/minimal";

export default function Home() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getHealth()
      .then(setHealth)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Forum Tutorial Starter
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        This page calls a minimal Go endpoint that reads counts from the
        database. It helps show how the backend and database connect before we
        build more features.
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : health ? (
        <Stack spacing={2}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
            <Typography variant="subtitle1">
              {health.message}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Database status: {health.database}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Server time: {new Date(health.time).toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
            <Typography variant="subtitle1" gutterBottom>
              Current database counts
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Box>
                <Typography variant="h6">{health.counts.users}</Typography>
                <Typography color="text.secondary">Users</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{health.counts.topics}</Typography>
                <Typography color="text.secondary">Topics</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{health.counts.posts}</Typography>
                <Typography color="text.secondary">Posts</Typography>
              </Box>
              <Box>
                <Typography variant="h6">{health.counts.comments}</Typography>
                <Typography color="text.secondary">Comments</Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      ) : (
        <Typography color="text.secondary">No data loaded yet.</Typography>
      )}
    </Box>
  );
}
