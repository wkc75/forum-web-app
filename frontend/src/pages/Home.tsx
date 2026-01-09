import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { getPosts } from "../api/posts";
import PostCard from "../components/PostCard";
import type { Post } from "../types/post";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const query = searchParams.get("q") ?? "";
  const sort =
    searchParams.get("sort") === "popular" ? "popular" : "newest";

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPosts({ search: query || undefined, sort })
      .then(setPosts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [query, sort]);

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    setSearchParams(params);
  };

  const handleSortChange = (value: "newest" | "popular") => {
    const params = new URLSearchParams(searchParams);
    if (value === "popular") {
      params.set("sort", "popular");
    } else {
      params.delete("sort");
    }
    setSearchParams(params);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Discover Posts
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Search posts"
          value={query}
          onChange={(event) => handleSearchChange(event.target.value)}
          fullWidth
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-posts">Sort by</InputLabel>
          <Select
            labelId="sort-posts"
            label="Sort by"
            value={sort}
            onChange={(event) =>
              handleSortChange(event.target.value as "newest" | "popular")
            }
          >
            <MenuItem value="newest">Newest</MenuItem>
            <MenuItem value="popular">Most liked</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : posts.length === 0 ? (
        <Typography color="text.secondary">No posts yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </Stack>
      )}
    </Box>
  );
}
