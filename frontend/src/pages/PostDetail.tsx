import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  Button,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
} from "@mui/material";

import { getComments, createComment, deleteComment } from "../api/comments";
import { deletePost } from "../api/posts";
import { apiFetch } from "../api/client";
import type { Comment } from "../types/comment";
import type { Post } from "../types/post";
import { getMe } from "../api/auth";

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
  const [me, setMe] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");

  useEffect(() => {
    Promise.all([
      apiFetch<Post>(`/api/posts/${postId}`),
      getComments(postId),
      getMe().then((u) => u.username).catch(() => null),
    ])
      .then(([p, c, user]) => {
        setPost(p);
        setComments(c);
        setMe(user);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

  const likePost = async () => {
    await apiFetch(`/api/posts/${postId}/like`, { method: "POST" });
    setPost((prev) =>
      prev ? { ...prev, likesCount: prev.likesCount + 1 } : prev
    );
  };

  const submitComment = async () => {
    if (!text.trim()) return;
    await createComment(text.trim(), postId);
    setComments(await getComments(postId));
    setText("");
  };

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm("Delete this post?")) return;
    await deletePost(post.id);
    navigate(-1);
  };

  if (loading) return <CircularProgress />;
  if (!post) return <Typography>Post not found.</Typography>;

  return (
    <Box>
      <Typography variant="h4">{post.title}</Typography>
      <Typography color="text.secondary">by {post.creatorUsername}</Typography>

      {me === post.creatorUsername && (
        <Button color="error" onClick={handleDeletePost}>
          Delete Post
        </Button>
      )}

      <Typography sx={{ my: 2 }}>{post.content}</Typography>

      <Button variant="outlined" onClick={likePost}>
        👍 Like ({post.likesCount})
      </Button>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6">Comments</Typography>

      {comments.length === 0 ? (
        <Typography>No comments yet.</Typography>
      ) : (
        <List>
          {comments.map((c) => (
            <ListItem
              key={c.id}
              secondaryAction={
                me === c.creatorUsername && (
                  <Button
                    color="error"
                    onClick={async () => {
                      await deleteComment(c.id);
                      setComments(await getComments(postId));
                    }}
                  >
                    Delete
                  </Button>
                )
              }
            >
              <ListItemText
                primary={c.content}
                secondary={`by ${c.creatorUsername}`}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Box sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Add comment"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button sx={{ mt: 1 }} onClick={submitComment} disabled={!text.trim()}>
          Comment
        </Button>
      </Box>
    </Box>
  );
}
