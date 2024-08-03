import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import * as qrcode from 'qrcode';

type EditVoterModalProps = {
    isOpen?: boolean;
    onOpenChange?: (e: boolean) => void;
    url: string;
}

export default function VerificationModal({ isOpen, onOpenChange, url }: EditVoterModalProps) {
    const [qrCodeURL, setQrCodeURL] = useState<string>("");

    const generateQRCode = async (str_code: string): Promise<string | null> => {
        try {
            const qrCodeData = await new Promise<string>((resolve, reject) => {
                qrcode.toDataURL(str_code, (err, data) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve(data);
                    }
                });
            });

            return qrCodeData;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const VerifySecret = async () => {
        const qrCodeData = await generateQRCode(url);
        setQrCodeURL(qrCodeData ?? "");
    }

    useEffect(() => {
        VerifySecret();
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} defaultOpen={false}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Voter verification</DialogTitle>
                    <DialogDescription>
                        Scan the QR Code.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center h-full">
                    <img src={qrCodeURL} className="w-64 h-64" />
                </div>

                <DialogFooter className="flex justify-center items-center"/>
            </DialogContent>
        </Dialog>
    )
}