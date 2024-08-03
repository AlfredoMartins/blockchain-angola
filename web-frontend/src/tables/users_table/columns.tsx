/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from "@tanstack/react-table"
import CustomDropMenuUser from "./CustomDropMenuUser"
import { User } from "@/data_types";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "password",
        header: "Password",
        cell: ({ row }) => {
            const password: string = row.getValue("password");
            if (typeof password === 'string')
                return (
                    <span>{password.substring(0, ("0xabcdef123456789").length)}...</span>
                );
            else return '';
        }
    },
    {
        accessorKey: "photo",
        header: "Photo",
        cell: ({ row }) => {
            const user = row.original;
            const url = user.photo;
            return (
                <>
                    <img height={60} width={60} src={url} className="rounded-full"></img>
                </>
            )
        },
    },
    {
        accessorKey: "refreshToken",
        header: "Refresh Token",
        cell: ({ row }) => {
            const refreshToken: string = row.getValue("refreshToken");
            if (typeof refreshToken === 'string')
                return (
                    <span>{refreshToken.substring(0, ("rerewrwererxabcdef123456789").length)}...</span>
                );
            else return '';
        }
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "timestamp",
        header: "Created at",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;
            return (
                <>
                    <CustomDropMenuUser user={user} />
                </>
            )
        },
    },
]