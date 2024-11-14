import AddTodoInput from "@/components/add-todo-input";

export default function Page() {
  return (
    <main className="flex flex-col gap-5">
      <AddTodoInput />
      <h2>Your Todos</h2>
      <div className="flex flex-col gap-2"></div>
    </main>
  );
}
