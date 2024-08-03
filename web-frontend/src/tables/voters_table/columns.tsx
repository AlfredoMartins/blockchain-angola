/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table"
import CustomDropMenuVoter from "./CustomDropMenuVoters"
import { Voter } from "@/data_types";

export const columns: ColumnDef<Voter>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "identifier",
        header: "Identifier",
    },
    {
        accessorKey: "electoralId",
        header: "Electoral Number",
    },
    {
        accessorKey: "choiceCode",
        header: "Choice Code",
    },
    {
        accessorKey: "state",
        header: "Vote State",
        cell: ({ row }) => {
            const state: string = row.getValue("state");
            if (state !== "false") {
                return (
                    <span className="text-right bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-md dark:bg-green-900 dark:text-green-300">
                        Done
                    </span>);
            }

            return (
                <span className="text-right  bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-md dark:bg-red-900 dark:text-red-300">
                    Not yet
                </span>
            );
        },
    },
    {
        accessorKey: "secret",
        header: "Verification",
        cell: ({ row }) => {
            const secret: string = row.getValue("secret");
            if (typeof secret === 'string')
                return (
                    <span>{secret.substring(0, ("0xabcdef123456789").length)}...</span>
                );
            else return '';
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const voter = row.original;
            return (
                <>
                    <CustomDropMenuVoter voter={voter} />
                </>
            )
        },
    },
]
