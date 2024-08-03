import { Transaction } from "@/data_types";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Transaction>[] = [
    {
        accessorKey: "id",
        header: "#",
    },
    {
        accessorKey: "transactionHash",
        header: "Hash Transaction",
        cell: ({ row }) => {
            const transactionHash: string = row.getValue("transactionHash");
            if (typeof transactionHash === 'string')
                return transactionHash.substring(0, ("0xabcdef123456789").length);
            return '';
        }
    },
    {
        accessorKey: "identifier",
        header: "Vote ID",
        cell: ({ row }) => {
            const identifier: string = row.getValue("identifier");
            if (typeof identifier === 'string')
                return (<span>{identifier.substring(0, ("000000000").length)}</span>);

            return '';
        }
    },
    {
        accessorKey: "choiceCode",
        header: "Vote",
        cell: ({ row }) => {
            let choiceCode: string = row.getValue("choiceCode");
            
            if (typeof choiceCode === 'string') {
                choiceCode = choiceCode === '-' ? '' : choiceCode;
                return (<span>{choiceCode.substring(0, ("000000000").length)}...</span>);
            }
            return '';
        }
    },
    {
        accessorKey: "voteTime",
        header: "Date and Time",
        cell: ({ row }) => {
            const x: number = parseInt(row.getValue("voteTime") as string);
            return new Date(x).toUTCString();
        }
    }
]