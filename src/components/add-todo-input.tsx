import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import toast from "react-hot-toast";

export default function AddTodoInput({
  onCreate,
}: {
  onCreate: (s: string) => void;
}) {
  const [todo, setTodo] = useState<string>("");
  const isTodoValid = todo.trim() !== "";
  const createTodoHelper = () => {
    if (isTodoValid) {
      onCreate(todo);
    } else {
      toast.error("Invalid Todo");
    }
  };
  return (
    <div className="space-y-2">
      <Label htmlFor="input-21">Create New Todo</Label>
      <div className="flex rounded-lg shadow-sm shadow-black/5">
        <Input
          id="input-21"
          className="-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10"
          placeholder="todo"
          onChange={(e) => setTodo(e.target.value)}
        />
        <button
          onClick={createTodoHelper}
          className="inline-flex items-center bg-black text-white rounded-e-lg border border-input bg-background px-3 text-sm font-medium text-foreground ring-offset-background transition-shadow hover:bg-accent hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          Create
        </button>
      </div>
    </div>
  );
}
