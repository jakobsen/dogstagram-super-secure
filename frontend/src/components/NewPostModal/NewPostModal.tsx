import { Dialog } from "@reach/dialog";
import "@reach/dialog/styles.css";
import { XCircle } from "react-feather";
import { useState } from "react";
import styled from "styled-components";
import axios from "axios";

interface NewPostModalProps {
  isOpen: boolean;
  onDismiss: () => void;
}

function NewPostModal({ isOpen, onDismiss }: NewPostModalProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [body, setBody] = useState("");
  const submitIsDisabled = body.length === 0 || imageUrl.length === 0;

  const submitPost = (e: React.FormEvent) => {
    e.preventDefault();
    axios
      .post("/posts/", { imageUrl, body })
      .then(() => {
        setImageUrl("");
        setBody("");
      })
      .catch()
      .finally(onDismiss);
  };

  return (
    <StyledDialog
      aria-label="Nytt innlegg"
      isOpen={isOpen}
      onDismiss={onDismiss}
    >
      <CloseButton onClick={onDismiss}>
        <XCircle />
      </CloseButton>
      <Form onSubmit={submitPost}>
        <Label>
          Bildelenke
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </Label>
        <Label>
          Bildetekst
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </Label>
        <SubmitButton
          type="submit"
          value="Publiser nytt innlegg"
          disabled={submitIsDisabled}
        />
      </Form>
    </StyledDialog>
  );
}

const StyledDialog = styled(Dialog)`
  width: max-content !important;
  border-radius: 16px;
  padding: 80px 40px;
  position: relative;
`;

const CloseButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: #666;
  position: absolute;
  top: 16px;
  right: 16px;

  &:hover {
    color: var(--text-color);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: max-content;
  margin: 0 auto;
  padding: 16px;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
`;

const SubmitButton = styled.input`
  appearance: none;
  background-color: #52b7ef;
  border-radius: 4px;
  border: none;
  color: white;
  font-size: ${14 / 16}rem;
  font-weight: 700;
  padding: 5px 9px;

  &:disabled {
    background: #b2dffc;
  }
`;

export default NewPostModal;
