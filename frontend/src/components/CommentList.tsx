import {
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import type { Comment } from "../types/comment";
import { formatDate } from "../utils/format";

interface CommentListProps {
  comments: Comment[];
  canDelete?: (comment: Comment) => boolean;
  onDelete?: (comment: Comment) => void;
  emptyMessage?: string;
}

export default function CommentList({
  comments,
  canDelete,
  onDelete,
  emptyMessage = "No comments yet.",
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        {emptyMessage}
      </Typography>
    );
  }

  return (
    <List>
      {comments.map((comment) => (
        <ListItem
          key={comment.id}
          secondaryAction={
            canDelete?.(comment) ? (
              <Button color="error" onClick={() => onDelete?.(comment)}>
                Delete
              </Button>
            ) : null
          }
        >
          <ListItemText
            primary={
              <Stack spacing={0.5}>
                <Typography>{comment.content}</Typography>
                <Typography variant="caption" color="text.secondary">
                  by {comment.creatorUsername} · {formatDate(comment.createdAt)}
                </Typography>
              </Stack>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
