import { updateGroup } from "@/api/groups/update";
import "./Settings.css";
import { useCurrentUser } from "@/utils/context/user-context";
import { updateGroupSchema } from "@/validation/update-group-schema";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { getGroupParticipants } from "@/api/users/get-participants";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AcceptIcon from "@mui/icons-material/Done";
import { getJoinRequests } from "@/api/groups/joinRequestsList";
import { acceptRequest } from "@/api/groups/accept-request";
import { declineRequest } from "@/api/groups/decline-request";
import { changeRole } from "@/api/groups/change-role";
import type { USER_ROLE } from "@/api/groups/entity";

export const Route = createFileRoute("/groups/$id/settings")({
  component: RouteComponent,
  loader: async () => {
    const participants = await getGroupParticipants();
    try {
      const joinRequests = await getJoinRequests();
      if (participants.success) {
        return {
          participants: participants.data,
          joinRequests: joinRequests.success ? joinRequests.data : undefined,
        };
      } else {
        throw notFound();
      }
    } catch (e) {
      if (participants.success) {
        return {
          participants: participants.data,
          joinRequests: undefined,
        };
      } else {
        throw notFound();
      }
    }
  },
});

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#fbf3fd",
  },
}));

function RouteComponent() {
  const { participants, joinRequests } = Route.useLoaderData();
  const { currentUser, fetchCurrentUser } = useCurrentUser();
  const navigate = Route.useNavigate();

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

  async function onAccept(userId: string) {
    const res = await acceptRequest({
      userId,
      groupId: currentUser?.groups?.id as string,
    });
    if (res.success) {
      navigate({ to: `/groups/${currentUser?.groups?.id}/settings` });
    }
  }

  async function onDecline(userId: string) {
    const res = await declineRequest({
      userId,
      groupId: currentUser?.groups?.id as string,
    });
    if (res.success) {
      navigate({ to: `/groups/${currentUser?.groups?.id}/settings` });
    }
  }

  return (
    <div className="w-[100%] px-16 py-10">
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
              <TableBody className="py-1">
                {participants.map((participant) => (
                  <TableRow key={participant.id}>
                    <TableCell>{participant.name}</TableCell>
                    <TableCell>{participant.email}</TableCell>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Role
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Role"
                        value={participant.role}
                        onChange={async (e) => {
                          const res = await changeRole({
                            role: e.target
                              .value as (typeof USER_ROLE)[keyof typeof USER_ROLE],
                            userId: participant.id,
                          });
                          if (res.success) {
                            navigate({
                              to: `/groups/${currentUser?.groups?.id}/settings`,
                            });
                          }
                        }}
                      >
                        <MenuItem value={"participant"}>Participant</MenuItem>
                        <MenuItem value={"admin"}>Admin</MenuItem>
                        <MenuItem value={"owner"}>Owner</MenuItem>
                      </Select>
                    </FormControl>
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
        {joinRequests && (
          <div className="w-[50%] flex flex-col gap-4">
            <span className="text-3xl font-semibold">Запити на приєднання</span>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <TableCell>Ім'я</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Дата запиту</TableCell>
                    <TableCell>Опції</TableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {joinRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>{request.name}</TableCell>
                      <TableCell>{request.email}</TableCell>
                      <TableCell>
                        {" "}
                        {new Date(request.joined).toLocaleDateString("uk-UA", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                      </TableCell>
                      <TableCell>
                        <IconButton onClick={() => onAccept(request.id)}>
                          <AcceptIcon />
                        </IconButton>
                        <IconButton onClick={() => onDecline(request.id)}>
                          <CloseIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        )}
      </div>
    </div>
  );
}
