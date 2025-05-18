import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="w-[100%] px-16 py-10">
      <span className="text-3xl font-semibold">Вітання!</span>
    </div>
  );
}
