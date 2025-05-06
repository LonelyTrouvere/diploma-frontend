import "./login.css";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { postUser } from "@/api/users/post";
import { signUpSchema } from "@/validation/sign-up-form-shcema";

export const Route = createFileRoute("/signup")({
  component: Signup,
});

function Signup() {
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const navigate = useNavigate();

  async function formAction(formData: FormData) {
    const formValues = signUpSchema.safeParse(Object.fromEntries(formData));
    if (!formValues.success) {
      const formated = formValues.error.format();
      setErrorFields(Object.keys(formated));
    } else {
      setErrorFields([]);
      await postUser(formValues.data);
      navigate({ to: "/login" });
    }
  }

  return (
    <div
      id="login-page"
      className="w-[100%] h-[100%] flex justify-center content-center"
    >
      <form
        id="login-page__form"
        action={formAction}
        className="bg-white rounded-md flex flex-col gap-5 px-6 py-4"
      >
        <span className="text-3xl font-semibold">Вітаємо!</span>
        <div>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Ім'я: </label>
            <input
              className={errorFields.includes("name") ? "error-field" : ""}
              type="text"
              placeholder="Введіть..."
              name="name"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email: </label>
            <input
              className={errorFields.includes("email") ? "error-field" : ""}
              type="text"
              placeholder="Введіть..."
              name="email"
            />
          </div>
        </div>
        <div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Пароль: </label>
            <input
              className={errorFields.includes("password") ? "error-field" : ""}
              type="password"
              placeholder="Введіть..."
              name="password"
            />
          </div>
        </div>
        <button
          className="w-32 text-xl text-center rounded-2xl bg-fuchsia-100 hover:bg-fuchsia-300 px-4 py-2 cursor-pointer"
          type="submit"
        >
          Увійти
        </button>
      </form>
    </div>
  );
}
