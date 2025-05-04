import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { User } from "./lib/models";
import { createSession, verifySession } from "./lib/actions/session";

export const { signIn, signOut, handlers } = NextAuth({
  providers: [Google],
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "google" && profile?.email_verified) {
        const { email } = profile!;

        const checkUser = await User.findOne({ email });

        if (checkUser) {
          await Promise.resolve(
            createSession({
              userId: checkUser.id,
              username: checkUser.username,
            }),
          );
          return `/create-username?username=${checkUser.username}`;
        } else {
          const newUser = new User({
            email: profile?.email,
            name: profile?.name,
            avatar: profile?.picture,
            password: process.env.GOOGLE_CODE,
          });

          await Promise.all([
            newUser.save(),
            createSession({
              userId: newUser.id,
              username: newUser.username,
            }),
          ]);
          return `/create-username`;
        }
      }
      return false;
    },
    async redirect({ url, baseUrl }) {
      const { username } = await verifySession();

      if (!username && url.startsWith("/")) {
        return `${baseUrl}/create-username`;
      }
      return `${baseUrl}/${username}`;
    },
  },
});
