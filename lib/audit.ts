import { Prisma } from "@prisma/client";
import type { PrismaClient } from "@prisma/client";

type AuditLogClient = Prisma.TransactionClient | PrismaClient;

type AuditLogData = {
  userId: string;
  action: string;
  entity: string;
  entityId?: string;
  detail?: string;
  ipAddress?: string;
};

export async function recordAuditLog(client: AuditLogClient, data: AuditLogData) {
  try {
    await client.auditLog.create({ data });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
      return null;
    }

    throw error;
  }

  return null;
}
