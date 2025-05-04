import "./page.css";
import { getGroups } from "@/api/groups/get";
import { createFileRoute } from "@tanstack/react-router";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { postGroup } from "@/api/groups/post";

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
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [createName, setCreateName] = useState<string>("");

  const handleOpenCreateModal = () => setOpenCreateModal(true);
  const handleCloseCreateModal = () => setOpenCreateModal(false);

  const onCreateGroup = async () => {
    if (createName) {
      await postGroup({ name: createName });
    }
  };

  return (
    <div id="group-page" className="px-32 py-12">
      <div id="group-page__header" className="mb-10 relative text-center">
        <div></div>
        <span className="text-3xl font-semibold">Оберіть групу</span>
        <div className="flex gap-3 absolute top-0 right-0">
          <button
            onClick={() => console.log("kek")}
            className="text-xl text-center rounded-2xl bg-blue-100 hover:bg-blue-300 px-4 py-2 cursor-pointer"
          >
            Доєднатись
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="text-xl text-center rounded-2xl bg-blue-100 hover:bg-blue-300 px-4 py-2 cursor-pointer"
          >
            Створити
          </button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-5 w-[100%]">
        {groups.map((group) => (
          <div
            key={group.id}
            className="group-name h-16 rounded-xl text-xl flex justify-center content-evenly py-2 px-4 hover:bg-blue-200"
          >
            {group.name}
          </div>
        ))}
      </div>
      <Modal
        open={openCreateModal}
        onClose={handleCloseCreateModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
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
            className="w-32 text-xl text-center rounded-2xl bg-blue-100 hover:bg-blue-300 px-4 py-2 cursor-pointer"
            type="submit"
            disabled={!createName}
          >
            Ок
          </button>
        </form>
      </Modal>
    </div>
  );
}
