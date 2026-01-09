import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Post } from "../types/post";
import { formatDate } from "../utils/format";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Card variant="outlined">
      <CardActionArea component={Link} to={`/post/${post.id}`}>
        <CardContent>
          <Stack spacing={1}>
            <Typography variant="h6">{post.title}</Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Chip size="small" label={post.topicName} />
              <Typography variant="body2" color="text.secondary">
                by {post.creatorUsername}
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {formatDate(post.createdAt)} · {post.likesCount} likes
            </Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
