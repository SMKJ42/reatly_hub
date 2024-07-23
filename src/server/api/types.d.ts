export type RealtyHubRole =
  | "admin"
  | "super-admin"
  | "owner"
  | "user"
  | "author";

export type ServerContext = {
  userId: string | null;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  role: RealtyHubRole;
  ip: string;
};
