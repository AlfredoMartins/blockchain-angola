/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@/components/ui/button';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { CandidadeModal } from './operation-candidate';
import { Candidate } from '@/data_types';

type CustomDropMenuProps = {
    candidate: Candidate
}

export default function CustomDropMenuCandidate({ candidate }: CustomDropMenuProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <CandidadeModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} setData={candidate.setEditCandidate} toast={candidate.toast} defaultValues={candidate} mode={false} />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => navigator.clipboard.writeText(JSON.stringify(candidate))}>
                        Copy row data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsModalOpen(true)}> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        const toast = candidate.toast;
                        toast({
                            title: "Feedback",
                            description: "Operation not supported."
                        });
                    }}>Remove</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}