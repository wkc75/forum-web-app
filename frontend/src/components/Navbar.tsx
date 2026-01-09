import { useEffect, useState, type FormEvent } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  TextField,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") ?? "");
  }, [location.search]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      navigate("/");
      return;
    }
    navigate(`/?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
        >
          My Forum
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            size="small"
            placeholder="Search posts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            sx={{ bgcolor: "white", borderRadius: 1, minWidth: 180 }}
          />
        </Box>

        <Button color="inherit" component={Link} to="/topics">
          Topics
        </Button>
        <Button color="inherit" component={Link} to="/profile">
          Profile
        </Button>
        <Button
          color="inherit"
          component={Link}
          to="/new"
          disabled={!user}
        >
          Create Post
        </Button>
      </Toolbar>
    </AppBar>
  );
}
