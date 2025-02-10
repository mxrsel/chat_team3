import { IMessage } from "../../../../typesUI.ts";
import React from "react";
import Message from "./Message/Message.tsx";

interface Props {
  messages: IMessage[];
}

const Messages: React.FC<Props> = ({ messages }) => {
  return (
    <>
      {messages.map((message) => (
        <Message key={message._id} message={message} />
      ))}
    </>
  );
};

export default Messages;
