import { useContext, useState } from "react";
import styled from "styled-components";
import UserContext from "../../useContext";
import { PlusSquare } from "react-feather";
import NewPostModal from "../NewPostModal";

interface HeaderProps {
  onLogOut: () => void;
}

function Header({ onLogOut }: HeaderProps) {
  const { username } = useContext(UserContext);
  const [showNewPostDialog, setShowNewPostDialog] = useState(false);
  return (
    <Wrapper>
      <Container>
        <Title href="/">Dogstagram</Title>
        <RightWrapper>
          <NewPostButton onClick={() => setShowNewPostDialog(true)}>
            <PlusSquare />
          </NewPostButton>
          <Username>{username ?? "admin"}</Username>
          <LogOut onClick={onLogOut}>Logg ut</LogOut>
        </RightWrapper>
      </Container>
      <NewPostModal
        isOpen={showNewPostDialog}
        onDismiss={() => setShowNewPostDialog(false)}
      />
    </Wrapper>
  );
}

const Wrapper = styled.header`
  background-color: #fff;
  border-bottom: 1px #dbdbdb solid;
`;

const Container = styled.div`
  max-width: 1000px;
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 32px;
`;

const RightWrapper = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  font-size: ${14 / 16}rem;
`;

const NewPostButton = styled.button`
  color: #aaa;
  background: none;
  appearance: none;
  border: none;

  &:hover {
    color: inherit;
    cursor: pointer;
  }
`;

const Username = styled.span`
  &:before {
    content: "@";
  }
  font-weight: 600;
`;

const LogOut = styled.button`
  color: #666;
  border: none;
  background: none;
  appearance: none;
  cursor: pointer;

  &:hover {
    color: var(--text-color);
  }
`;

const Title = styled.a`
  font-family: "Lobster Two", cursive;
  font-style: italic;
  font-weight: 400;
  font-size: 2rem;
  color: inherit;
  text-decoration: none;
`;

export default Header;
