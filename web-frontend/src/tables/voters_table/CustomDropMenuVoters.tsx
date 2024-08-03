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
import { Voter } from './columns';
import VerificationModal from './verification-modal';
import RevealModal from './reveal-voter';

type CustomDropMenuProps = {
    voter: Voter
}

export default function CustomDropMenuVoter({ voter }: CustomDropMenuProps) {
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
    const [isRevealModalOpen, setIsRevealModalOpen] = useState(false);

    return (
        <>
            <VerificationModal isOpen={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen} url={voter.secret} />
            <RevealModal isOpen={isRevealModalOpen} onOpenChange={setIsRevealModalOpen} identifier={voter.identifier} />

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(voter).toString())}
                    >
                        Copy row data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setIsVerificationModalOpen(true)}>Verification Code</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsRevealModalOpen(true)}>Reveal voter</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
}