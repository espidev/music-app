type DBAccount = {
  uuid: string
  username: string
  password_argon2: string
};

type APIAccount = {
  uuid: string
  username: string
};

function getAPIAccount(account: DBAccount) {
  return {
    uuid: account.uuid,
    username: account.username,
  } as DBAccount;
}