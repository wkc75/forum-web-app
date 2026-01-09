import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMyComments, getMyPosts } from "../api/me";
import type { Post } from "../types/post";
import type { Comment } from "../types/comment";
import PostCard from "../components/PostCard";
import { formatDate } from "../utils/format";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user, loading, login, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      return;
    }
    Promise.all([getMyPosts(), getMyComments()])
      .then(([posts, comments]) => {
        setPosts(posts);
        setComments(comments);
      })
      .catch((err) => setError(err.message));
  }, [user]);

  const handleLogin = async () => {
    if (!username.trim()) return;
    try {
      setError(null);
      await login(username.trim());
      setUsername("");
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    await logout();
    setPosts([]);
    setComments([]);
  };

  if (loading) {
    return <CircularProgress />;
  }

  // 🔓 Logged out
  if (!user) {
    return (
      <Box>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

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
        Logged in as {user}
      </Typography>

      <Button variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          My Posts
        </Typography>
        {posts.length === 0 ? (
          <Typography color="text.secondary">No posts yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </Stack>
        )}
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          My Comments
        </Typography>
        {comments.length === 0 ? (
          <Typography color="text.secondary">No comments yet.</Typography>
        ) : (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <Box key={comment.id}>
                <Typography>{comment.content}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {comment.postTitle ? (
                    <>
                      on{" "}
                      <Button
                        component={Link}
                        to={`/post/${comment.postId}`}
                        size="small"
                      >
                        {comment.postTitle}
                      </Button>
                    </>
                  ) : null}
                  · {formatDate(comment.createdAt)}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
