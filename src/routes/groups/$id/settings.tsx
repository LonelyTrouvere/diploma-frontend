import { updateGroup } from "@/api/groups/update";
import "./Settings.css";
import { useCurrentUser } from "@/utils/context/user-context";
import { updateGroupSchema } from "@/validation/update-group-schema";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getGroupParticipants } from "@/api/users/get-participants";
import {
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const Route = createFileRoute("/groups/$id/settings")({
  component: RouteComponent,
  loader: async () => {
    const participants = await getGroupParticipants();
    if (participants.success) {
      return {
        participants: participants.data,
      };
    } else {
      throw notFound();
    }
  },
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#fbf3fd',
  },
}));

function RouteComponent() {
  const { participants } = Route.useLoaderData();
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
            value={currentUser?.groups?.id}
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
      <div className="flex gap-8 mt-5">
        <div className="w-[50%] flex flex-col gap-4">
          <span className="text-3xl font-semibold">Учасники</span>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <StyledTableRow>
                  <TableCell>Учасник</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Роль</TableCell>
                  <TableCell>Дата приєднання</TableCell>
                </StyledTableRow>
              </TableHead>
              <TableBody>
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                    <TableCell>{participant.role.toUpperCase()}</TableCell>
                    <TableCell>
                      {new Date(participant.joined).toLocaleDateString(
                        "uk-UA",
                        {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        }
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="w-[50%] flex flex-col gap-4">
          <span className="text-3xl font-semibold">Запити на приєднання</span>
        </div>
      </div>
    </div>
  );
}
