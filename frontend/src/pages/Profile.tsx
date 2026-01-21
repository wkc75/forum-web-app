import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { getProfile, type ProfileResponse } from "../api/minimal";

export default function Profile() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getProfile()
      .then(setProfile)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Profile (from the database)
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        This page calls a minimal endpoint that creates a demo user (if needed)
        and returns simple counts.
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}

      {profile ? (
        <Stack spacing={2}>
          <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
            <Typography variant="subtitle1">Username</Typography>
            <Typography variant="h6">{profile.username}</Typography>
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
              <Typography variant="subtitle1">Posts</Typography>
              <Typography variant="h6">{profile.postCount}</Typography>
            </Box>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: "background.paper" }}>
              <Typography variant="subtitle1">Comments</Typography>
              <Typography variant="h6">{profile.commentCount}</Typography>
            </Box>
          </Stack>
        </Stack>
      ) : (
        <Typography color="text.secondary">No profile data yet.</Typography>
      )}
    </Box>
  );
}
