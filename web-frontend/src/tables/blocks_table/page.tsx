
import { GLOBAL_VARIABLES } from "@/global/globalVariables";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function TableBlocks() {
    const URI = 'http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/blocks';

    const { isLoading, error, data, refetch } = useQuery({
        queryKey: ['blocks'],
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
