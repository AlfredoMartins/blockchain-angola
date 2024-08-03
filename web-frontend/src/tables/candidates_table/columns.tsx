/* eslint-disable @typescript-eslint/no-explicit-any */

import { ColumnDef } from "@tanstack/react-table"

import CustomDropMenuCandidate from "./CustomDropMenuCandidate"
import { Candidate } from "@/data_types"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader";

export const columns: ColumnDef<Candidate>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "code",
        header: "Code",
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full-name" />
        ),
    },
    {
        accessorKey: "candidadePhoto",
        header: "Candidade Photo",
        cell: ({ row }) => {
            const user = row.original;
            const url = user.candidadePhoto;
            return (
                <>
                    <img height={60} width={60} src={url} className="rounded-full"></img>
                </>
            )
        },
    },
    {
        accessorKey: "partyImage",
        header: "Party Image",
        cell: ({ row }) => {
            const user = row.original;
            const url = user.partyImage;
            return (
                <>
                    <img height={60} width={60} src={url} className="rounded-full"></img>
                </>
            )
        },
    },
    {
        accessorKey: "party",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Party" />
        ),
    },
    {
        accessorKey: "acronym",
        header: "Acronym"
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status: string = row.getValue("status");

            if (status === "verified") {
                return (
                    <span className="text-right bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-md dark:bg-green-900 dark:text-green-300">
                        {status}
                    </span>);
            }
            else if (status === "pending" || status === "processing") {
                return (
                    <span className="text-right bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-md dark:bg-orange-900 dark:text-orange-300">
                        {status}
                    </span>
                )
            }

            return (
                <span className="text-right  bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-md dark:bg-red-900 dark:text-red-300">
                    {status}
                </span>
            );

        },
    },

    {
        id: "actions",
        cell: ({ row }) => {
            const candidate = row.original
            return (
                <>
                    <CustomDropMenuCandidate candidate={candidate} />
                </>
            )
        },
    },
]
