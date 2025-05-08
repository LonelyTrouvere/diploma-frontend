import { updateGroup } from "@/api/groups/update";
import "./Settings.css";
import { useCurrentUser } from "@/utils/context/user-context";
import { updateGroupSchema } from "@/validation/update-group-schema";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/groups/$id/settings")({
  component: RouteComponent,
});

function RouteComponent() {
  const { currentUser, fetchCurrentUser } = useCurrentUser();

  async function formAction(formData: FormData) {
    const formValues = updateGroupSchema.safeParse(
      Object.fromEntries(formData)
    );
    if (formValues.success) {
      const res = await updateGroup(formValues.data);
      if (res.success) {
        await fetchCurrentUser();
      }
    }
  }

  return (
    <div className="w-[100%] px-6">
      <span className="text-3xl font-semibold">Налаштування</span>
      <form
        action={formAction}
        id="settings-page__form"
        className="flex flex-col gap-5 px-6 py-4 w-[40%]"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="id">ID групи: </label>
          <input
            type="text"
            placeholder={currentUser?.groups?.id}
            name="id"
            disabled
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="name">Ім'я: </label>
          <input
            type="text"
            placeholder={currentUser?.groups?.name}
            name="name"
          />
        </div>
        <button
          className="w-32 text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
          type="submit"
        >
          Оновити
        </button>
      </form>
    </div>
  );
}
