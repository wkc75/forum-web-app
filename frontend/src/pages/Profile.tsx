import { useEffect, useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { login, getMe, logout } from "../api/auth";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [me, setMe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .then((u) => setMe(u.username))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async () => {
    if (!username.trim()) return;
    try {
      await login(username.trim());
      setMe(username.trim());
      setUsername("");
    } catch (e: any) {
      alert(e.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    setMe(null);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  // 🔓 Logged out
  if (!me) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mr: 2 }}
        />

        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
      </Box>
    );
  }

  // 🔒 Logged in
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Logged in as {me}
      </Typography>

      <Button variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
