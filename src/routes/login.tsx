import { login } from "@/api/users/login";
import "./login.css";
import { createFileRoute } from "@tanstack/react-router";
import { loginSchema } from "@/validation/login-form-schema";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const [errorFields, setErrorFields] = useState<string[]>([]);

  async function formAction(formData: FormData) {
    const formValues = loginSchema.safeParse(Object.fromEntries(formData));
    if (!formValues.success) {
      const formated = formValues.error.format();
      setErrorFields(Object.keys(formated));
    } else {
      setErrorFields([]);
      await login(formValues.data);
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
            <label htmlFor="name">Email: </label>
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
            <label htmlFor="name">Пароль: </label>
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
