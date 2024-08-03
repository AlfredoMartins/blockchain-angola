"use client"

import { ColumnDef } from "@tanstack/react-table";
import { ProgressBar } from "./ProgressBar";
import { CandidateResults } from "@/data_types"

export const columns: ColumnDef<CandidateResults>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "candidate",
        header: "Candidate"
    },
    {
        accessorKey: "party",
        header: "Party"
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
        accessorKey: "numOfVotes",
        header: "Total # of votes",
        cell: ({ row }) => {
            const progress: number = parseFloat(row.original.percentage);
            const numVotes = row.original.numVotes;

            return <div className="flex flex-col justify-center items-center text-center">
                <ProgressBar value={progress} />
                <div className="flex flex-col">
                    <span>
                        {numVotes} votes

                    </span>
                    <span>
                        {progress}%
                    </span>
                </div>
            </div>

        },
    }
]