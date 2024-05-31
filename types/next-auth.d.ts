import NextAuth, { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      isAdmin: boolean;
      name: string;
      email: string;
      image?: string;
    };
  }

  interface User extends DefaultUser {
    id: string;
    isAdmin: boolean;
  }
}
