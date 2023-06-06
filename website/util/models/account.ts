export type DBAccount = {
  uuid: string
  username: string
  password_argon2: string
};

export type APIAccount = {
  uuid: string
  username: string
};

export function getAPIAccount(account: DBAccount) {
  return {
    uuid: account.uuid,
    username: account.username,
  } as DBAccount;
}