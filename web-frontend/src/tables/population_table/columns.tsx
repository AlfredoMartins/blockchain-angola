/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { Citizen } from "@/data_types"
import { DataTableColumnHeader } from "@/components/ui/DataTableColumnHeader"
import CustomDropMenuPopulation from "./CustomDropMenuPopulation"

export const columns: ColumnDef<Citizen>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "electoralId",
        header: "Electoral Number",
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Full-name" />
        ),
    },
    {
        accessorKey: "address",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Address
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "province",
        header: "Province",
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
            const citizen = row.original;
            return (
                <>
                    <CustomDropMenuPopulation citizen={citizen} setData={citizen.setData} toast={citizen.toast}/>
                </>
            )
        },
    },
]