import { getServerSession } from "next-auth";
import { OnRampTransactions } from "../../../components/OnRampTransaction";
import { SendCard } from "../../../components/SendCard";
import { authOptions } from "../../lib/auth";
import prisma from "@repo/db/client";
import { P2PTransactions } from "../../../components/P2PTransactions";

async function getP2PTransactions() {
    const session = await getServerSession(authOptions)

    const transactions = await prisma.p2pTransfer.findMany({
        where : {
            OR : [
                {fromUserId : Number(session?.user?.id) },
                {toUserId : Number(session?.user?.id) } 
            ]
        }
    })

    return transactions.map(txn => {
        return {
            time: txn.timestamp, // Assuming timestamp is a Date object
            amount: txn.amount,
            from: txn.fromUserId == session.user.id ? undefined : txn.fromUserId,
            to: txn.toUserId == session.user.id ? undefined : txn.toUserId,
        };
    });
}

export default async function() {

    const transactions = await getP2PTransactions();
    return <div className="w-full flex justify-evenly items-center">
        <SendCard />
        <div>
            <div className="pt-4">
                <P2PTransactions transactions={transactions} />
            </div>
        </div>
    </div>
}