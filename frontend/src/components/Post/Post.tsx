import axios from "axios";
import { useContext, useState } from "react";
import { Heart } from "react-feather";
import styled from "styled-components";
import UserContext from "../../useContext";
import { IComment, IPost } from "../Feed/types";

interface PostProps {
  post: IPost;
}

function Post({ post }: PostProps) {
  const [comment, setComment] = useState("");
  const [postComments, setPostComments] = useState([...post.comments]);
  const [postLikes, setPostLikes] = useState([...post.likes]);

  const { username } = useContext(UserContext);
  const userLikesPost = postLikes.includes(username as string);

  const postComment = () => {
    axios
      .post<IComment>(`posts/${post.id}/comment`, { comment })
      .then(({ data }) => {
        setPostComments([...postComments, data]);
        setComment("");
      })
      .catch(console.error);
  };

  function onLike() {
    const likeUrl = `posts/${post.id}/like`;
    if (userLikesPost) {
      axios
        .delete(likeUrl)
        .then(() =>
          setPostLikes(postLikes.filter((user) => user !== username))
        );
    } else {
      axios
        .post(likeUrl)
        .then(() => setPostLikes([...postLikes, username as string]));
    }
  }

  return (
    <Container>
      <Top>
        <SmallBold>{post.author}</SmallBold>
      </Top>
      <Image src={post.imageurl} onDoubleClick={onLike} />
      <Bottom>
        <Likes>
          <LikeButton onClick={onLike}>
            <Heart
              stroke={userLikesPost ? "#ed4956" : "currentColor"}
              fill={userLikesPost ? "#ed4956" : "transparent"}
              size={20}
            />
          </LikeButton>
          <SmallBold>{postLikes.length} liker dette</SmallBold>
        </Likes>
        <Comments>
          {postComments.map((comment) => (
            <Comment key={comment.id}>
              <SmallBold>{comment.username}</SmallBold>
              <div
                dangerouslySetInnerHTML={{
                  __html: comment.body,
                }}
              />
            </Comment>
          ))}
        </Comments>
        <NewCommentBox>
          <Input
            placeholder="Skriv en kommentar …"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <PublishButton disabled={comment.length === 0} onClick={postComment}>
            Publiser
          </PublishButton>
        </NewCommentBox>
      </Bottom>
    </Container>
  );
}

const Container = styled.article`
  border: solid 1px var(--border-color);
  background-color: #fff;
  border-radius: 8px;
`;

const Top = styled.div`
  padding: 8px 16px;
`;

const Image = styled.img`
  display: block;
  width: 100%;
`;

const Bottom = styled.div`
  padding: 8px 16px;
`;

const SmallBold = styled.span`
  font-size: ${14 / 16}rem;
  font-weight: 700;
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const LikeButton = styled.button`
  appearance: none;
  border: none;
  padding: 0;
  background: none;
`;

const Comments = styled.div`
  padding-block: 8px;
`;

const Comment = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const NewCommentBox = styled.div`
  display: flex;
`;

const Input = styled.input`
  appearance: none;
  border: none;
  flex: 1;

  &:focus {
    outline: none;
  }
`;

const PublishButton = styled.button`
  appearance: none;
  background: none;
  border: none;
  color: #52b7ef;
  font-weight: 700;

  &:disabled {
    color: #b2dffc;
  }
`;

export default Post;
