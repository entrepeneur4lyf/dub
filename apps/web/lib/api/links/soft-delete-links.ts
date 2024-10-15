import { prisma } from "@/lib/prisma";

export const softDeleteLink = async (linkId: string) => {
  return await prisma.link.update({
    where: {
      id: linkId,
    },
    data: {
      deletedAt: new Date(),
    },
    include: {
      tags: true,
    },
  });
};

export const softDeleteManyLinks = async (linkIds: string[]) => {
  return await prisma.link.updateMany({
    where: {
      id: { in: linkIds },
    },
    data: {
      deletedAt: new Date(),
    },
  });
};
