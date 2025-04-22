export const onlineUsers = global.online_users ||  (global.online_users = new Map()); 

export function addUserToOnlineUsers(userId: string, controller: ReadableStreamDefaultController) {
  onlineUsers.set(userId, controller);
  console.log(`User ${userId} added to online users.`);
}

export function removeUserFromOnlineUsers(userId: string) {
  const removed = onlineUsers.delete(userId);
  console.log(`User ${userId} removed from online users:`, removed);
}
