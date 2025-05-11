import "./topicId.css";
import { USER_ROLE } from "@/api/groups/entity";
import { getTopic } from "@/api/topics/get";
import { useCurrentUser } from "@/utils/context/user-context";
import { IconButton, Paper, styled } from "@mui/material";
import { createFileRoute, notFound } from "@tanstack/react-router";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { createCommentSchema } from "@/validation/create-comment";
import { postComment } from "@/api/comments/post";
import { deleteTopic } from "@/api/topics/delete";

export const Route = createFileRoute("/groups/$id/$topicId")({
  component: RouteComponent,
  loader: async (data) => {
    const topic = await getTopic(data.params.topicId);
    if (!topic.success) {
      throw notFound();
    }
    return { topic: topic.data };
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
  const { topic } = Route.useLoaderData();
  const { currentUser } = useCurrentUser();
  const navigate = Route.useNavigate();

  async function formAction(formData: FormData) {
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
    <div className="w-[100%] px-6">
      <div className="flex justify-between content-center mb-8 gap-2">
        <span className="text-3xl font-semibold">{topic.name}</span>
        {currentUser?.groups_to_users?.role !== USER_ROLE.participant && (
          <div className="min-w-20">
            {" "}
            <IconButton>
              <EditIcon />
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
        </span>
      </div>
      <Paper className="w-[70%] flex flex-col">
        <form className="relative" action={formAction}>
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
    </div>
  );
}
