import { PublicKey } from "@solana/web3.js";
import { Button } from "./ui/button";
import { Check, Trash2 } from "lucide-react";
import { useTodoProgramAccount } from "./todo/todo-data-access";
import { cn } from "@/lib/utils";

const TodoCard = ({ account }: { account: PublicKey }) => {
  const { accountQuery, deleteTodo, markAsCompletedTodo } =
    useTodoProgramAccount({
      account,
    });

  const title = accountQuery.data?.title;

  const onMarkAsCompleted = () => {
    markAsCompletedTodo.mutateAsync(title!);
  };
  const onDelete = () => {
    deleteTodo.mutateAsync(title!);
  };

  return (
    <div className="flex flex-row justify-between border p-2 px-3 rounded-xl">
      <div
        className={cn("flex items-center justify-center", {
          "line-through": accountQuery.data?.isDone,
        })}
      >
        {accountQuery.data?.title}
      </div>
      <div className="flex items-center justify-between gap-1">
        {accountQuery.data?.isDone === false && (
          <Button
            variant={"outline"}
            onClick={onMarkAsCompleted}
            disabled={markAsCompletedTodo.isPending}
          >
            <Check />
          </Button>
        )}
        <Button
          variant={"destructive"}
          disabled={deleteTodo.isPending}
          onClick={onDelete}
        >
          <Trash2 />
        </Button>
      </div>
    </div>
  );
};

export default TodoCard;
