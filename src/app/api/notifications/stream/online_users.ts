export const onlineUsers = new Map<string, ReadableStreamDefaultController>();

export function addUserToOnlineUsers(userId: string, controller: ReadableStreamDefaultController) {
  onlineUsers.set(userId, controller);
  console.log(`User ${userId} added to online users.`);
}


export function removeUserFromOnlineUsers(userId: string) {
  const removed = onlineUsers.delete(userId);
  console.log(`User ${userId} removed from online users:`, removed);
}

export function getUserController(userId: string) {
  return onlineUsers.get(userId) || null;
}
