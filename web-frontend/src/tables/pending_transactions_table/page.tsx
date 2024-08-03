/* eslint-disable @typescript-eslint/no-explicit-any */
import { GLOBAL_VARIABLES } from "@/global/globalVariables";
import { columns } from "./columns";

import {
    useQuery,
} from '@tanstack/react-query'

import { useEffect } from "react";
import { DataTable } from "../pending_transactions_table/data-table";

export default function TablePendingTransactions() {
    const URI = 'http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/pending-transactions';

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['pending'],
        queryFn: () =>
            fetch(URI).then((res) =>
                res.json(),
            ),
    });

    useEffect(() => {
        const intervalId = setInterval(() => {
            refetch();
        }, 5000); // 5000 milliseconds = 5 seconds

        return () => clearInterval(intervalId);
    }, [refetch]);

    if (isLoading) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    return (
        <section>
            <DataTable columns={columns} data={data} />
        </section>
    );
}
