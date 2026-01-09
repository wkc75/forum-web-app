import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Alert,
  Typography,
  CircularProgress,
  Button,
  Box,
  Divider,
  TextField,
  Stack,
} from "@mui/material";

import { getComments, createComment, deleteComment } from "../api/comments";
import { deletePost } from "../api/posts";
import { apiFetch } from "../api/client";
import type { Comment } from "../types/comment";
import type { Post } from "../types/post";
import CommentList from "../components/CommentList";
import { formatDate } from "../utils/format";
import { useAuth } from "../context/AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  if (!id) {
    return <Typography>Invalid post.</Typography>;
  }

  const postId = Number(id);
  if (isNaN(postId)) {
    return <Typography>Invalid post.</Typography>;
  }

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      apiFetch<Post>(`/api/posts/${postId}`),
      getComments(postId),
    ])
      .then(([p, c]) => {
        setPost(p);
        setComments(c);
      })
      .catch((err) => {
        setLoadError(err.message);
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [postId]);

  const likePost = async () => {
    if (!user) return;
    try {
      await apiFetch(`/api/posts/${postId}/like`, { method: "POST" });
      setPost((prev) =>
        prev ? { ...prev, likesCount: prev.likesCount + 1 } : prev
      );
    } catch (err: any) {
      setActionError(err.message || "Failed to like post.");
    }
  };

  const submitComment = async () => {
    if (!text.trim() || !user) return;
    try {
      setActionError(null);
      await createComment(text.trim(), postId);
      setComments(await getComments(postId));
      setText("");
    } catch (err: any) {
      setActionError(err.message || "Failed to add comment.");
    }
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm("Delete this post?")) return;
    await deletePost(post.id);
    navigate(-1);
  };

  if (loading) return <CircularProgress />;
  if (loadError) return <Alert severity="error">{loadError}</Alert>;
  if (!post) return <Typography>Post not found.</Typography>;

  return (
    <Box>
      <Typography variant="h4">{post.title}</Typography>
      <Stack spacing={0.5} sx={{ mb: 2 }}>
        <Typography color="text.secondary">
          by {post.creatorUsername} · {formatDate(post.createdAt)}
        </Typography>
        <Typography color="text.secondary">
          Topic: {post.topicName}
        </Typography>
      </Stack>

      {user === post.creatorUsername && (
        <Button color="error" onClick={handleDeletePost}>
          Delete Post
        </Button>
      )}

      <Typography sx={{ my: 2 }}>{post.content}</Typography>

      <Button variant="outlined" onClick={likePost} disabled={!user}>
        👍 Like ({post.likesCount})
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Comments</Typography>

      {actionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {actionError}
        </Alert>
      )}

      <CommentList
        comments={comments}
        canDelete={(comment) => user === comment.creatorUsername}
        onDelete={async (comment) => {
          await deleteComment(comment.id);
          setComments(await getComments(postId));
        }}
      />

      {!user && (
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Log in to like or comment.
        </Typography>
      )}

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Add comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!user}
        />
        <Button
          sx={{ mt: 1 }}
          onClick={submitComment}
          disabled={!text.trim() || !user}
        >
          Comment
        </Button>
      </Box>
    </Box>
  );
}
