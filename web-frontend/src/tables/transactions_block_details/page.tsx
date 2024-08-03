/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Transaction } from "@/data_types";

export default function TableTransactionsBlockDetails({ detail }: any) {
    const getTransactionsDetails = (transactions: any) => {
        const res = transactions.map((x: any, index: any) => {
            const newVal = {
                id: index + 1,
                transactionHash: x.transactionHash,
                identifier: x.data.identifier,
                choiceCode: x.data.choiceCode,
                voteTime: x.data.voteTime,
            };

            return newVal;
        });

        return res;
    }

    const [data, setData] = useState<Transaction[]>(getTransactionsDetails(detail['transactions']));

    useEffect(() => {
        // console.log("Data -> ", detail['transactions']);
        setData(getTransactionsDetails(detail['transactions']));
    }, [detail]);

    return (
        <section>
            <DataTable columns={columns} data={data} />
        </section>
    );
}