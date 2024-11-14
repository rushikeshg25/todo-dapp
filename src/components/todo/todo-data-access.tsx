"use client";

import { getTodoProgram, getTodoProgramId } from "@project/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { Cluster, Keypair, PublicKey } from "@solana/web3.js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { useCluster } from "../cluster/cluster-data-access";
import { useAnchorProvider } from "../solana/solana-provider";
import { useTransactionToast } from "../ui/ui-layout";

export function useTodoProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getTodoProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getTodoProgram(provider);

  const accounts = useQuery({
    queryKey: ["todo", "all", { cluster }],
    queryFn: () => program.account.todo.all(),
  });

  const getProgramAccount = useQuery({
    queryKey: ["get-program-account", { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const createTodo = useMutation({
    mutationKey: ["todo", "create", { cluster }],
    mutationFn: async (title: string) => {
      // const [todoAccountAddress] = await PublicKey.findProgramAddressSync(
      //   [Buffer.from(title), owner.toBuffer()],
      //   programId
      // );
      return program.methods.createTodo(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      accounts.refetch();
    },
    onError: () => toast.error("Failed to create Todo"),
  });

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createTodo,
  };
}

export function useTodoProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const { program, accounts } = useTodoProgram();

  const accountQuery = useQuery({
    queryKey: ["todo", "fetch", { cluster, account }],
    queryFn: () => program.account.todo.fetch(account),
  });

  const deleteTodo = useMutation({
    mutationKey: ["todo", "delete", { cluster }],
    mutationFn: async (title: string) => {
      return program.methods.deleteTodo(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to Delete Todo"),
  });

  const markAsCompletedTodo = useMutation({
    mutationKey: ["todo", "update", { cluster }],
    mutationFn: async (title: string) => {
      return program.methods.markTodoAsDone(title).rpc();
    },
    onSuccess: (signature) => {
      transactionToast(signature);
      return accounts.refetch();
    },
    onError: () => toast.error("Failed to mark Todo as completed"),
  });

  return {
    accountQuery,
    markAsCompletedTodo,
    deleteTodo,
  };
}
