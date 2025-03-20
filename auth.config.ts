import { z } from "zod";
 
 
 
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";

 import db from "./prisma/prisma";
import { AuthOptions } from "next-auth";

const CredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's name. */
      name: string | null;
      email: string | null;
      
      image: string | null;
    };
  }
}

 

 

export default {
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        pasword: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedFields = CredentialsSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return null;
        }

        const { email, password } = validatedFields.data;

        const user = await db.user.findUnique({
          where: { email: email }, // Look up the user by email
        });

        // 2. If no user or no password is found, return null
        if (!user || !user.password) {
          return null;
        }

        // 3. Compare the password with the hashed password
        const passwordsMatch = password == user.password

        // 4. If passwords don't match, return null
        if (!passwordsMatch) {
          return null;
        }

        // 5. Return the user if authentication is successful
        return user;
      },
      
    }),

    // GitHub,
    // Google
  ],
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.SCREATE,

  session: {
    strategy: "jwt",

  },
  
 
  callbacks: {
    
    async jwt({ token, user }) {
     

      return token;
    },
    
    session: async ({ session, token }) => {
       
   
      return session;
    },

  
  },
} satisfies AuthOptions
