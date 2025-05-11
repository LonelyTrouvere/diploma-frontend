"use client";

import {
  StreamVideo,
  StreamVideoClient,
  type User,
} from "@stream-io/video-react-sdk";
import { useEffect, useState, type ReactNode } from "react";
import { useCurrentUser } from "./user-context";
import { generateStreamToken } from "@/api/users/generate-stream-token";

interface Props {
  children: ReactNode;
}

export default function StreamIOClientProvider({ children }: Props) {
  const client = useInitClient();
  if (!client) {
    return <>{children}</>;
  }

  return <StreamVideo client={client}>{children}</StreamVideo>;
}

function useInitClient() {
  const { currentUser } = useCurrentUser();
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    if (!currentUser) {
      return;
    }

    let streamUser: User;
    streamUser = {
      id: currentUser.id,
      name: currentUser.name,
    };

    const apiKey = import.meta.env.VITE_PUBLIC_STREAM_KEY;
    const streamSecret = import.meta.env.VITE_STREAM_SECRET;
    if (!apiKey || !streamSecret) {
      throw new Error("Configuration not provided");
    }

    const client = new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider: generateStreamToken,
    });

    setClient(client);

    return () => {
      client.disconnectUser();
      setClient(null);
    };
  }, [currentUser?.id, currentUser?.name]);

  return client;
}
