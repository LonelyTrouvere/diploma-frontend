import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {
  return (
    <div className="h-[1000px]">
      <h1>hello</h1>
    </div>
  );
}
