import prisma from "@/lib/prisma";

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({ where: { id } });
};

export const updateUser = async (id: string, data: { name?: string; email?: string }) => {
  return await prisma.user.update({ where: { id }, data });
};
