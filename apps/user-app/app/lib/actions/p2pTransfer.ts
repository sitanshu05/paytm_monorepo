"use server"
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
    const session = await getServerSession(authOptions);
    const from = session?.user?.id;
    if (!from) {
        return {
            message: "Error while sending"
        }
    }
    const toUser = await prisma.user.findFirst({
        where: {
            number: to
        }
    });

    if (!toUser) {
        return {
            message: "User not found"
        }
    }
    await prisma.$transaction(async (transaction) => {
        await transaction.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;
        const fromBalance = await transaction.balance.findUnique({
            where: { userId: Number(from) },
          });
          if (!fromBalance || fromBalance.amount < amount) {
            throw new Error('Insufficient funds');
          }

          await transaction.balance.update({
            where: { userId: Number(from) },
            data: { amount: { decrement: amount } },
          });

          await transaction.balance.update({
            where: { userId: toUser.id },
            data: { amount: { increment: amount } },
          });

          await transaction.p2pTransfer.create({
            data : {
                fromUserId : Number(from),
                toUserId : toUser.id,
                amount : Number(amount),
                timestamp : new Date()
            }
          })
    });
}