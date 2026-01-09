import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My Forum
          </Typography>

          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/topics">Topics</Button>
          <Button color="inherit" component={Link} to="/new">New Post</Button>
          <Button color="inherit" component={Link} to="/profile">Profile</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Outlet />
      </Box>
    </>
  );
}
