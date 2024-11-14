#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("CsDQ5hCD7iQWTy3MvbRvoysQbo5tGQ92wemqjbMEQPUT");

#[program]
pub mod todo {
    use super::*;
    pub fn create_todo(ctx: Context<CreateTodo>, title: String) -> Result<()> {
        msg!("New todo Created");
        *ctx.accounts.new_todo=Todo{
            title,
            owner:ctx.accounts.owner.key(),
            is_done:false,
            bump:ctx.bumps.new_todo
        };
        Ok(())
    }
    pub fn delete_todo(ctx: Context<DeleteTodo>, title: String) -> Result<()> {
        msg!("Todo Deleted");
        Ok(())
    }
    pub fn update_todo(ctx: Context<UpdateTodo>, title: String) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateTodo<'info> {
    #[account(
        init,
        seeds = [title.as_bytes(), owner.key().as_ref()], 
        bump, 
        payer = owner, 
        space = 8 + Todo::INIT_SPACE
    )]
    pub new_todo: Account<'info, Todo>,

    #[account(mut)]
    pub owner: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateTodo<'info> {}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteTodo<'info> {

    #[account(mut)]
    pub owner:Signer<'info>,
    #[account(
        mut,
        seeds=[title.as_bytes(),owner.key().as_ref()],
        bump,
        close=owner
    )]
    pub delete_todo:Account<'info,Todo>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct MarkAsDone<'info>{}

#[account]
#[derive(Debug,InitSpace)]
pub struct Todo {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    pub bump:u8,
    pub is_done:bool
}
