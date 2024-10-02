"use server"

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnRampTransaction(amount : number , provider : string) {

    const session = await getServerSession(authOptions);
    const userId = session.user.id; 

    const token = Math.random().toString()

    if(!userId){
        return {
            message : "User not logged in"
        }
    }

    await prisma.onRampTransaction.create({
        data : {
            amount : amount,
            status : "Processing",
            userId : Number(userId),
            startTime : new Date(),
            provider,
            token : token
        }
    })


    return {
        message : "On ramp transaction created"
    }
}