import {
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import type { Topic } from "../types/topic";
import { formatDate } from "../utils/format";

interface TopicCardProps {
  topic: Topic;
  showDelete?: boolean;
  onDelete?: () => void;
}

export default function TopicCard({ topic, showDelete, onDelete }: TopicCardProps) {
  return (
    <Card variant="outlined">
      <CardActionArea component={Link} to={`/topic/${topic.id}`}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.5}>
              <Typography variant="h6">{topic.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                by {topic.creatorUsername}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(topic.createdAt)}
              </Typography>
            </Stack>
            {showDelete && (
              <Button
                color="error"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  onDelete?.();
                }}
              >
                Delete
              </Button>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
