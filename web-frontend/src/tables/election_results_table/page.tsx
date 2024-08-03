
import { CandidateResults } from "@/data_types";
import { columns } from "./columns";
import { DataTable } from "./data-table";

type TableElectionResultProps = {
    data: CandidateResults[],
}

export default function TableElectionResults({data}: TableElectionResultProps) {
    if (data === undefined) {
        return (
            <div><span>Table unavaialble!</span></div>
        );
    }

    return (
        <section>
            <DataTable columns={columns} data={data} />
        </section>
    );
}
