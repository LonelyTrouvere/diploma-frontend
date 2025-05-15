import "./topicId.css";
import { USER_ROLE } from "@/api/groups/entity";
import { getTopic } from "@/api/topics/get";
import { useCurrentUser } from "@/utils/context/user-context";
import { IconButton, Modal, Paper, styled } from "@mui/material";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import CallIcon from "@mui/icons-material/Call";
import { createCommentSchema } from "@/validation/create-comment";
import { postComment } from "@/api/comments/post";
import { deleteTopic } from "@/api/topics/delete";
import { useStreamVideoClient } from "@stream-io/video-react-sdk";
import { getGroupParticipants } from "@/api/users/get-participants";
import { useState } from "react";
import { updateTopic } from "@/api/topics/update";
import { updateTopicSchema } from "@/validation/update-topic-schema";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { createMeetingSchema } from "@/validation/create-meeting";
import { postEvent } from "@/api/events/post";

export const Route = createFileRoute("/groups/$id/$topicId")({
  component: RouteComponent,
  loader: async (data) => {
    const topic = await getTopic(data.params.topicId);
    const participants = await getGroupParticipants();
    if (!topic.success || !participants.success) {
      throw notFound();
    }
    return { topic: topic.data, participants: participants.data };
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
  const { topic, participants } = Route.useLoaderData();
  const { currentUser } = useCurrentUser();
  const navigate = Route.useNavigate();
  const client = useStreamVideoClient();
  const [openUpdateTopic, setOpenUpdateTopic] = useState<boolean>(false);
  const [openCreateMeeting, setOpenCreateMeeting] = useState<boolean>(false);
  const [isReccuring, setIsRecurring] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const handleOpenUpdateTopic = () => setOpenUpdateTopic(true);
  const handleCloseUpdateTopuc = () => setOpenUpdateTopic(false);

  const handleOpenCreateMeeting = () => setOpenCreateMeeting(true);
  const handleCloseCreateMeeting = () => setOpenCreateMeeting(false);

  const meetingEvent = topic.events.find((event) => event.type === "meeting");
  const deadlineEvent = topic.events.find((event) => event.type === "deadline");

  async function commentFormAction(formData: FormData) {
    const formValues = createCommentSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (formValues.success) {
      const res = await postComment({
        ...formValues.data,
        topicId: topic.id,
      });
      if (res.success) {
        navigate({
          to: "/groups/$id/$topicId",
          params: { id: currentUser?.groups?.id, topicId: topic.id },
        });
      }
    }
  }

  async function updateTopicFormAction(formData: FormData) {
    const formValues = updateTopicSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!formValues.success) {
      const formated = formValues.error.format();
      setErrorFields(Object.keys(formated));
    } else {
      setErrorFields([]);
      const res = await updateTopic({
        id: topic.id,
        description: formValues.data.description
          ? formValues.data.description
          : undefined,
        name: formValues.data.name ? formValues.data.name : undefined,
      });
      if (res.success) {
        setOpenUpdateTopic(false);
        navigate({
          to: "/groups/$id/$topicId",
          params: { id: currentUser?.groups?.id, topicId: topic.id },
        });
      } else {
        setErrorFields(["name", "password"]);
      }
    }
  }

  async function createMeetingFormAction(formData: FormData) {
    const formValues = createMeetingSchema.safeParse(
      Object.fromEntries(formData)
    );
    console.log(formValues.error);
    if (formValues.success) {
      if (!client) {
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call("default", id);
      await call.getOrCreate({
        data: {
          members: participants.map((user) => ({
            user_id: user.id,
            role: user.role,
          })),
        },
      });

      const eventRes = await postEvent({
        date: formValues.data.date,
        topicId: topic.id,
        type: "meeting",
        description: topic.name,
        recurring: isReccuring,
        recurringRule: formValues.data.recurringRule
          ? parseInt(formValues.data.recurringRule)
          : undefined,
      });

      const updateTopicRes = await updateTopic({
        id: topic.id,
        meetingId: id,
      });

      if (updateTopicRes.success && eventRes.success) {
        setOpenCreateMeeting(false);
        navigate({
          to: "/groups/$id/$topicId",
          params: { id: currentUser?.groups?.id, topicId: topic.id },
        });
      }
    }
  }

  async function onDelete() {
    const res = await deleteTopic(topic.id);
    if (res.success) {
      navigate({
        to: "/groups/$id",
        params: { id: currentUser?.groups?.id },
      });
    }
  }

  return (
    <div className="w-[100%] px-16 py-10">
      <div className="flex justify-between content-center mb-8 gap-2">
        <span className="text-3xl font-semibold">{topic.name}</span>
        {currentUser?.groups_to_users?.role !== USER_ROLE.participant && (
          <div className="min-w-20">
            {" "}
            <IconButton onClick={handleOpenUpdateTopic}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={handleOpenCreateMeeting}>
              <CallIcon />
            </IconButton>
            <IconButton onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </div>
        )}
      </div>
      <div className="pl-4 w-[60%] mb-8">
        <span className="text-xl/relaxed">
          {topic.description ?? "No description provided"}
          {topic.meetingId && meetingEvent && (
            <>
              <br />
              <br />
              <Link
                to="/groups/meeting/$meetingId"
                params={{ meetingId: topic.meetingId }}
              >
                <span className="text-blue-700 underline">
                  Мітинг заплановано на{" "}
                  {new Date(meetingEvent.date).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </span>
              </Link>
            </>
          )}
          {deadlineEvent && (
            <>
              {" "}
              <br /> <br />
              <span className="font-bold">
                Тема дійсна до{" "}
                {new Date(deadlineEvent.date).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                !
              </span>
            </>
          )}
        </span>
      </div>
      <Paper className="w-[70%] flex flex-col">
        <form className="relative" action={commentFormAction}>
          <input
            className="w-[100%] h-12"
            type="text"
            placeholder="Коментар"
            name="content"
          />
          <StyledIconButton type="submit">
            <SendIcon />
          </StyledIconButton>
        </form>
        {topic.comments.map((comment) => (
          <div
            className="comment-box flex flex-col gap-[2px] px-4 py-2"
            key={comment.id}
          >
            <div className="flex justify-between content-center">
              <span className="font-bold text-[20px]">{comment.name}</span>
              <span>
                {new Date(comment.timestamp).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
            </div>
            <span>{comment.content}</span>
          </div>
        ))}
      </Paper>
      <Modal open={openUpdateTopic} onClose={handleCloseUpdateTopuc}>
        <form
          id="group-page__create"
          className="bg-white absolute m-auto rounded-md flex flex-col gap-5 px-6 py-4 w-2xl"
          action={updateTopicFormAction}
        >
          <span className="text-3xl font-semibold">Оновити тему</span>
          <div>
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Ім'я: </label>
              <input
                name="name"
                className={errorFields.includes("name") ? "error-field" : ""}
                type="text"
                placeholder="Введіть..."
              />
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-1">
              <label htmlFor="description">Опис: </label>
              <textarea
                name="description"
                className={
                  errorFields.includes("description") ? "error-field" : ""
                }
                placeholder="Введіть..."
              />
            </div>
          </div>
          <button
            className="w-32 text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
            type="submit"
          >
            Ок
          </button>
        </form>
      </Modal>
      <Modal open={openCreateMeeting} onClose={handleCloseCreateMeeting}>
        <form
          id="group-page__create"
          className="bg-white absolute m-auto rounded-md flex flex-col gap-5 px-6 py-4 w-2xl"
          action={createMeetingFormAction}
        >
          <span className="text-3xl font-semibold">Параметри зустрічі</span>
          <div>
            <div className="flex gap-3 content-center">
              <input
                name="recurring"
                type="checkbox"
                onChange={() => setIsRecurring(!isReccuring)}
              />
              <label htmlFor="recurring">Зустрі повторюється</label>
            </div>
          </div>
          {isReccuring && (
            <div>
              <div className="flex gap-3 content-center">
                <span>Зустріч повторюється кожні </span>
                <input
                  name="recurringRule"
                  type="number"
                  className="inline w-20"
                />
                <span>днів</span>
              </div>
            </div>
          )}
          <div>
            <div className="flex flex-col gap-1">
              <label htmlFor="date">Дата зустрічі: </label>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DemoContainer components={["DateTimePicker"]}>
                  <DateTimePicker name="date" />
                </DemoContainer>
              </LocalizationProvider>
            </div>
          </div>
          <button
            className="w-32 text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
            type="submit"
          >
            Створити
          </button>
        </form>
      </Modal>
    </div>
  );
}
