import { ColumnDef } from "@tanstack/react-table";
import { PendingTransaction } from "@/data_types"


export const columns: ColumnDef<PendingTransaction>[] = [
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
            return (<span>{transactionHash.substring(0, ("0xabcdef1459").length)}...</span>);

            return '';
        }
    },
    {
        accessorKey: "identifier",
        header: "Vote ID",
        cell: ({ row }) => {
            const choiceCode: string = row.getValue("choiceCode");
            if (typeof choiceCode === 'string')
                return (<span>{choiceCode.substring(0, ("000000000").length)}</span>);
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