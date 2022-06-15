import axios from "axios";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Post from "../Post/Post";
import { IPost } from "./types";

function Feed() {
  const [posts, setPosts] = useState<IPost[]>([]);
  useEffect(() => {
    axios.get("/posts").then((res) => setPosts(res.data.posts));
  }, []);
  if (posts.length === 0) return null;
  return (
    <Wrapper>
      {posts.map((post) => (
        <Post post={post} key={post.id} />
      ))}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 470px;
  margin-inline: auto;
  padding-top: 40px;
  padding-bottom: 120px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
`;

export default Feed;
