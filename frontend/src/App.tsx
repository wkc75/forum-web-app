import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Topics from "./pages/Topics";
import TopicDetail from "./pages/TopicDetail";
import PostDetail from "./pages/PostDetail";
import NewPost from "./pages/NewPost";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/topics" element={<Topics />} />
        <Route path="/topic/:id" element={<TopicDetail />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/new" element={<NewPost />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}
