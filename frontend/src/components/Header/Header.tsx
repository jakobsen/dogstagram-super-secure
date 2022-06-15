import { useContext } from "react";
import styled from "styled-components";
import UserContext from "../../useContext";
import { PlusSquare } from "react-feather";

interface HeaderProps {
  onLogOut: () => void;
}

function Header({ onLogOut }: HeaderProps) {
  const { username } = useContext(UserContext);
  return (
    <Wrapper>
      <Container>
        <Title>Dogstagram</Title>
        <RightWrapper>
          <NewPostButton />
          <Username>{username ?? "admin"}</Username>
          <LogOut onClick={onLogOut}>Logg ut</LogOut>
        </RightWrapper>
      </Container>
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

const NewPostButton = styled(PlusSquare)`
  color: #aaa;

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
  text-decoration: none;
`;

const Title = styled.h1`
  font-family: "Lobster Two", cursive;
  font-style: italic;
  font-weight: 400;
  font-size: 2rem;
`;

export default Header;
