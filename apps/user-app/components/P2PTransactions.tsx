import { Card } from "@repo/ui/card"




export const P2PTransactions = ({
    transactions
}: {
    transactions: {
        time : Date
        amount: number,
        from? : number,
        to ?: number
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t => {
                return (<div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    {t.to == undefined ? "+" : "-"}$ {t.amount / 100}
                </div>

            </div>)})}
        </div>
    </Card>
}