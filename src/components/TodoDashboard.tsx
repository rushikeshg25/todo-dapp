"use client";
import AddTodoInput from "@/components/add-todo-input";
import TodoCard from "@/components/todoCard";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTodoProgram } from "@/components/todo/todo-data-access";
import { WalletButton } from "./solana/solana-provider";

const TodoDashboard = () => {
  const { publicKey } = useWallet();
  const { createTodo } = useTodoProgram();

  const createTodoHandler = (todo: string) => {
    createTodo.mutateAsync(todo);
  };

  if (!publicKey) {
    return (
      <div className="flex flex-col gap-5">
        <div>Connect your wallet to create a todo</div>
        <div className="flex items-center justify-center">
          <WalletButton />
        </div>
      </div>
    );
  }

  return (
    <main className="flex flex-col gap-5 w-96">
      <AddTodoInput onCreate={createTodoHandler} />
      <h2>Your Todos</h2>
      <Todos />
    </main>
  );
};

export default TodoDashboard;

const Todos = () => {
  const { accounts, getProgramAccount } = useTodoProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }

  if (!getProgramAccount.data?.value) {
    return (
      <div className="flex justify-center alert alert-info">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }

  if (accounts.data?.length === 0) {
    return (
      <div className="flex justify-center border shadow-md  p-2 rounded-lg">
        <span className="font-bold">
          No Todos found. Create one above to get started.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {accounts.data?.map((account, i) => {
        return <TodoCard key={i} account={account.publicKey} />;
      })}
    </div>
  );
};
