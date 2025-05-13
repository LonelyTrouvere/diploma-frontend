import "./index.css";
import { USER_ROLE } from "@/api/groups/entity";
import { getTopics } from "@/api/topics/get-list";
import { postTopic } from "@/api/topics/post";
import { useCurrentUser } from "@/utils/context/user-context";
import { createTopicSchema } from "@/validation/create-topic-schema";
import { Modal } from "@mui/material";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/groups/$id/")({
  component: RouteComponent,
  loader: async () => {
    const topics = await getTopics();
    if (!topics.success) {
      throw notFound();
    }
    return { topics: topics.data };
  },
});

function RouteComponent() {
  const { topics } = Route.useLoaderData();
  const { currentUser } = useCurrentUser();
  const [openCreateTopic, setOpenCreateTopic] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const navigate = Route.useNavigate();

  const handleOpenCreateTopic = () => setOpenCreateTopic(true);
  const handleCloseCreateTopuc = () => setOpenCreateTopic(false);

  async function formAction(formData: FormData) {
    const formValues = createTopicSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (!formValues.success) {
      const formated = formValues.error.format();
      setErrorFields(Object.keys(formated));
    } else {
      setErrorFields([]);
      const res = await postTopic(formValues.data);
      if (res.success) {
        setOpenCreateTopic(false);
        navigate({
          to: "/groups/$id",
          params: { id: currentUser?.groups?.id },
        });
      } else {
        setErrorFields(["name", "password"]);
      }
    }
  }

  return (
    <div className="w-[100%] px-16 py-10">
      <div className="flex justify-between mb-8">
        <span className="text-3xl font-semibold">Список тем</span>
        {currentUser?.groups_to_users?.role !== USER_ROLE.participant && (
          <button
            className="text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
            type="button"
            onClick={handleOpenCreateTopic}
          >
            Додати тему
          </button>
        )}
      </div>
      <div className="flex flex-col gap-5 w-[80%]">
        {topics.map((topic) => (
          <Link
            to="/groups/$id/$topicId"
            params={{ id: currentUser!.groups!.id, topicId: topic.id }}
          >
            <div
              key={topic.id}
              className="bg-fuchsia-100 hover:bg-fuchsia-300 select-none cursor-pointer px-4 py-2 rounded-md flex justify-between content-center"
            >
              <span className="text-xl font-semibold">{topic.name}</span>
              <span>
                {new Date(topic.created).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
      <Modal open={openCreateTopic} onClose={handleCloseCreateTopuc}>
        <form
          id="group-page__create"
          className="bg-white absolute m-auto rounded-md flex flex-col gap-5 px-6 py-4 w-2xl"
          action={formAction}
        >
          <span className="text-3xl font-semibold">Створити нову тему</span>
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
    </div>
  );
}
