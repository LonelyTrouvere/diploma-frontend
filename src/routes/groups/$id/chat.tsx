import "./chat.css";
import { getGroupParticipants } from "@/api/users/get-participants";
import NavDiv from "@/components/styled/NavDiv";
import { IconButton, Paper, styled } from "@mui/material";
import { createFileRoute, notFound } from "@tanstack/react-router";
import SendIcon from "@mui/icons-material/Send";
import { createMessageSchema } from "@/validation/create-message";
import { postMessage } from "@/api/chat-message/post";
import { useState } from "react";
import { useCurrentUser } from "@/utils/context/user-context";
import type { ChatMessage } from "@/api/chat-message/entity";
import { getMessages } from "@/api/chat-message/get";
import { socket } from "@/api/socket-instance";

export const Route = createFileRoute("/groups/$id/chat")({
  component: RouteComponent,
  loader: async () => {
    const participants = await getGroupParticipants();
    if (!participants.success) {
      throw notFound();
    }
    return { participants: participants.data };
  },
});

const StyledIconButton = styled(IconButton)(() => ({
  "&": {
    position: "absolute",
    right: "8px",
    bottom: "4px",
  },
}));

function RouteComponent() {
  const { participants } = Route.useLoaderData();
  const [receiver, setReceiver] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { currentUser } = useCurrentUser();

  socket.on("new-message", (data) => {
    if (!messages.some((item) => item.id === data.id)) {
      setMessages([...messages, data]);
    }
  });

  async function sendFormAction(receiver: string, formData: FormData) {
    const formValues = createMessageSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (formValues.success) {
      await postMessage({
        ...formValues.data,
        receiverId: receiver,
      });
    }
  }

  async function onChooseChat(receiverId: string) {
    const res = await getMessages(receiverId);
    if (res.success) {
      socket.emit("choose-chat", { ...currentUser, receiverId });
      setMessages(res.data);
      setReceiver(receiverId);
    }
  }

  async function onChooseGroupChat() {
    const res = await getMessages(currentUser?.groups?.id as string);
    if (res.success) {
      socket.emit("choose-group-chat", { ...currentUser });
      setMessages(res.data);
      setReceiver(currentUser?.groups?.id as string);
    }
  }

  return (
    <div id="chat-page" className="flex">
      <nav
        id="app__navigation"
        className="w-48 h-screen fixed flex flex-col bg-fuchsia-50"
      >
        <NavDiv>
          <div
            className="w-[100%] h-[100%] flex justify-center content-center"
            onClick={onChooseGroupChat}
          >
            <span className="action-span">{currentUser?.groups?.name}</span>
          </div>
        </NavDiv>
        {participants.map((participant) => {
          if (participant.id !== currentUser?.id) {
            return (
              <NavDiv key={participant.name}>
                <div
                  className="w-[100%] h-[100%] flex justify-center content-center"
                  onClick={() => onChooseChat(participant.id)}
                >
                  <span className="action-span">{participant.name}</span>
                </div>
              </NavDiv>
            );
          }
        })}
      </nav>
      <div className="w-48"></div>
      {receiver && (
        <div className="flex justify-center content-center w-[100%]">
          <Paper className="px-10 py-8 h-[80%] w-[90%]">
            <div className="h-[90%] flex flex-col gap-2 overflow-y-scroll mb-5 pr-10">
              {messages.map((mes) => (
                <div>
                  <div className="flex justify-between content-center">
                    <span className="font-bold text-[20px]">{mes.name}</span>
                    <span>
                      {new Date(mes.timestamp).toLocaleDateString("uk-UA", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <span>{mes.message}</span>
                </div>
              ))}
            </div>
            <form
              className="relative"
              action={(formData) => sendFormAction(receiver, formData)}
            >
              <input
                className="w-[100%] h-12 rounded-b-none"
                type="text"
                placeholder="Коментар"
                name="message"
              />
              <StyledIconButton type="submit">
                <SendIcon />
              </StyledIconButton>
            </form>
          </Paper>
        </div>
      )}
    </div>
  );
}
