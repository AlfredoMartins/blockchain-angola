/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { columns } from "./columns";
import { DataTable } from "./data-table";

function TableUsers({ data }: any) {
    return (
        <section>
            <DataTable columns={columns} data={data}/>
        </section>
    );
}

export default TableUsers;