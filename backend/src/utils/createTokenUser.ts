export const createTokenUser = (user) => {
  return { username: user.username, userId: user.id, role: user.role };
};
