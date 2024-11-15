import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Todo } from "../target/types/todo";
import { before } from "node:test";

describe("todo", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const payer = provider.wallet as anchor.Wallet;

  const program = anchor.workspace.Todo as Program<Todo>;

  // Initialize variables
  const todoKeypair = Keypair.generate();
  const title: string = "Test Todo";

  // PDA for the todo account
  let todoPda: PublicKey;
  let todoBump: number;

  before(async () => {
    // Derive the PDA for the new todo
    [todoPda, todoBump] = PublicKey.findProgramAddressSync(
      [Buffer.from(title), payer.publicKey.toBuffer()],
      program.programId
    );
  });

  it("Creates a Todo", async () => {
    await program.methods
      .createTodo(title)
      .accounts({
        newTodo: todoPda,
        owner: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch the created Todo account
    const newTodo = await program.account.todo.fetch(todoPda);

    // Validate the data
    assert.equal(newTodo.title, title);
    assert.equal(newTodo.owner.toString(), payer.publicKey.toString());
    assert.isFalse(newTodo.isDone);
    assert.equal(newTodo.bump, todoBump);
  });

  it("Marks a Todo as Done", async () => {
    await program.methods
      .markTodoAsDone(title)
      .accounts({
        markAsDoneTodo: todoPda,
        owner: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Fetch the updated Todo account
    const updatedTodo = await program.account.todo.fetch(todoPda);

    // Validate that the todo is marked as done
    assert.isTrue(updatedTodo.isDone);
  });

  it("Deletes a Todo", async () => {
    await program.methods
      .deleteTodo(title)
      .accounts({
        deleteTodo: todoPda,
        owner: payer.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    // Attempt to fetch the deleted Todo account (should throw an error)
    try {
      await program.account.todo.fetch(todoPda);
      assert.fail("The Todo should have been deleted");
    } catch (error) {
      assert.include(error.message, "Account does not exist");
    }
  });
});
