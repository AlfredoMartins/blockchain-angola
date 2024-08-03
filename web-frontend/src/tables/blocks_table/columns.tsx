"use client"

import { Block } from "@/data_types";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";


export const columns: ColumnDef<Block>[] = [
    {
        accessorKey: "id",
        header: "#",
    },
    {
        accessorKey: "hashBlock",
        header: "Hash block",
        cell: ({ row }) => {
            const blockHash: string = row.getValue("hashBlock");
            if (typeof blockHash === 'string')
                return (
                    <Link to={`/blockchain/block-details/${blockHash}`}>
                    <span>{blockHash.substring(0, ("0xabcdef123456789").length)}...</span>
                  </Link>
                );
            return '';
        }
    },
    {
        accessorKey: "nonce",
        header: "Nonce"
    },
    {
        accessorKey: "numOfTransactions",
        header: "# of Tx",
    },
    {
        accessorKey: "dateAndTime",
        header: "Date and Time",
        cell: ({ row }) => {
            const x: number = parseInt(row.getValue("dateAndTime"));
            return new Date(x).toUTCString();
        }
    },
    {
        accessorKey: "size",
        header: "Size"
    }
]
