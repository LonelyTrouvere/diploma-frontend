import "./meeting.css";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import {
  Call,
  CallControls,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  useStreamVideoClient,
} from "@stream-io/video-react-sdk";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/groups/meeting/$meetingId")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();
  const { meetingId } = Route.useParams();
  const [call, setCall] = useState<Call>();
  const client = useStreamVideoClient();

  if (!client) {
    return <></>;
  }

  if (!call) {
    return (
      <div className="flex justify-center content-center">
        <button
          className="w-48 text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
          type="button"
          onClick={async () => {
            const call = client.call("default", meetingId);
            await call.join();
            setCall(call);
          }}
        >
          Join meeting
        </button>
      </div>
    );
  }

  return (
    <div>
      <StreamCall call={call}>
        <StreamTheme className="space-y-3">
          <SpeakerLayout />
          <CallControls onLeave={() => navigate({to: '/groups'})} />
        </StreamTheme>
      </StreamCall>
    </div>
  );
}
