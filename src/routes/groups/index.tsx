import "./page.css";
import { getGroups } from "@/api/groups/get";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { postGroup } from "@/api/groups/post";
import { useCurrentUser } from "@/utils/context/user-context";
import { loginGroup } from "@/api/groups/login";
import type { User } from "@/api/users/entity";
import { jwtDecode } from "jwt-decode";
import { joinRequestFromUser } from "@/api/groups/requestJoinFromUser";

export const Route = createFileRoute("/groups/")({
  component: GroupsPage,
  loader: async () => {
    const groups = await getGroups();
    return {
      groups,
    };
  },
});

function GroupsPage() {
  const { groups } = Route.useLoaderData();
  const { setCurrentUser } = useCurrentUser();
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openJoin, setOpenJoin] = useState<boolean>(false);
  const [createName, setCreateName] = useState<string>("");
  const [joinGroup, setJoinGroup] = useState<string>("");
  const navigate = useNavigate();

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const handleOpenJoinModal = () => setOpenJoin(true);
  const handleCloseJoinModal = () => setOpenJoin(false);

  const onCreateGroup = async () => {
    if (createName) {
      await postGroup({ name: createName });
    }
  };

  const onJoinGroup = async () => {
    if (joinGroup) {
      await joinRequestFromUser(joinGroup);
    }
  }

  const onLoginGroup = async (group: string) => {
    const res = await loginGroup(group);
    if (res.success) {
      const decoded = jwtDecode<User>(res.data.token);
      setCurrentUser(decoded);
      navigate({ to: "/groups/$id", params: { id: group } });
    }
  };

  return (
    <div id="group-page" className="px-32 py-12">
      <div id="group-page__header" className="mb-10 relative text-center">
        <div></div>
        <span className="text-3xl font-semibold">Оберіть групу</span>
        <div className="flex gap-3 absolute top-0 right-0">
          <button
            onClick={handleOpenJoinModal}
            className="text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
          >
            Доєднатись
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
          >
            Створити
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 w-[100%]">
        {groups.map((group) => (
            <div
              key={group.id}
              className="group-name h-16 rounded-xl text-xl flex justify-center content-evenly py-2 px-4 bg-fuchsia-100 hover:bg-fuchsia-200"
              onClick={() => onLoginGroup(group.id)}
            >
              {group.name}
            </div>
        ))}
      </div>
      <Modal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
      >
        <form
          id="group-page__create"
          className="bg-white absolute m-auto rounded-md flex flex-col gap-5 px-6 py-4"
        >
          <span className="text-3xl font-semibold">Створити нову групу</span>
          <div className="w-[90%]">
            <div className="flex flex-col gap-1">
              <label htmlFor="name">Ім'я: </label>
              <input
                className="px-2 py-1"
                type="text"
                placeholder="Введіть..."
                onChange={(e) => setCreateName(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={onCreateGroup}
            className="w-32 text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
            type="submit"
            disabled={!createName}
          >
            Ок
          </button>
        </form>
      </Modal>
      <Modal
        open={openJoin}
        onClose={handleCloseJoinModal}
      >
        <form
          id="group-page__create"
          className="bg-white absolute m-auto rounded-md flex flex-col gap-5 px-6 py-4"
        >
          <span className="text-3xl font-semibold">Доєднатись до групи</span>
          <div className="w-[90%]">
            <div className="flex flex-col gap-1">
              <label htmlFor="name">ID групи: </label>
              <input
                className="px-2 py-1"
                type="text"
                placeholder="Введіть..."
                onChange={(e) => setJoinGroup(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={onJoinGroup}
            className="w-32 text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
            type="submit"
            disabled={!joinGroup}
          >
            Ок
          </button>
        </form>
      </Modal>
    </div>
  );
}
