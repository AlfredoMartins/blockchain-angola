import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type EditVoterModalProps = {
    isOpen?: boolean;
    onOpenChange?: (e: boolean) => void;
    identifier: string;
}

export default function RevealModal({ isOpen, onOpenChange, identifier }: EditVoterModalProps) {

    const revealVoter = () => {
        
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Reveal Voter</DialogTitle>
                    <DialogDescription>
                        Scan the QR Code.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center h-full">
                    <span>Information to be added.</span>
                </div>

                <DialogFooter className="flex justify-center items-center">
                    <Button type="submit" onClick={() => {
                        // Handle click event
                    }}>OK</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}