import "next-auth";

declare module "next-auth" {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string;
      username: string;
      email?: string | null;
      image?: string | null;
    };
  }

  // eslint-disable-next-line no-unused-vars
  interface User {
    id: string;
    username: string;
    email: string;
  }
}
