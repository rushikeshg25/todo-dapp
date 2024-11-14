#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("CsDQ5hCD7iQWTy3MvbRvoysQbo5tGQ92wemqjbMEQPUT");

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo(ctx: Context<CreateTodo>, title: String) -> Result<()> {
        Ok(())
    }
    pub fn delete_todo(ctx: Context<DeleteTodo>, title: String) -> Result<()> {
        Ok(())
    }
    pub fn update_todo(ctx: Context<UpdateTodo>, title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateTodo<'info> {}

#[derive(Accounts)]
pub struct UpdateTodo<'info> {}

#[derive(Accounts)]
pub struct DeleteTodo<'info> {}

#[account]
pub struct Todo {
    pub title: String,
    pub ownser: Pubkey,
}
