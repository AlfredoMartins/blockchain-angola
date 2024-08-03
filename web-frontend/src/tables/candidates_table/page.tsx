/* eslint-disable @typescript-eslint/no-explicit-any */

import { columns } from "./columns";
import { DataTable } from "./data-table";

export default function TableCandidates({ data }: any) {

    return (
        <section>
            <DataTable columns={columns} data={data} />
        </section>
    );
}
