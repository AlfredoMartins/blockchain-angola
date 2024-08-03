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
import axios from "axios";
import { useState } from "react";
import { GLOBAL_VARIABLES } from '@/global/globalVariables';
import { EditCitizenModal } from './edit-citizen';
import { Citizen } from '@/data_types';

type CustomDropMenuProps = {
    citizen: Citizen,
    setData: any,
    toast: (...params: any[]) => void
}

export default function CustomDropMenuPopulation({ citizen, setData, toast}: CustomDropMenuProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    return (
        <>
            <EditCitizenModal isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} defaultValues={citizen} setData={setData} toast={toast} />
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
                        onClick={() => navigator.clipboard.writeText(citizen.id.toString())}
                    >
                        Copy row data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => {

                        const email_to = citizen.email;
                        const toast = citizen.toast;
                        const options = {
                            email: email_to
                        };

                        axios.post(`http://${GLOBAL_VARIABLES.LOCALHOST}/api/committee/send-email`, options)
                            .then(response => {
                                if (response.status === 200) {
                                    const data = response.data;
                                    // console.log("Success response:", data);
                                    toast({
                                        title: "Feedback",
                                        description: "Success! Credentials sent to the voter.",
                                    });
                                }
                            }).catch(error => {
                                console.error(error)
                                toast({
                                    title: "Feedback",
                                    description: "Error! Something went wrong."
                                });
                            });

                    }} > Send credentials</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}> Edit
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => {
                        const electoralId = citizen.electoralId;
                        const toast = citizen.toast;
                        const setData = citizen.setData;

                        const options = {
                            electoralId: electoralId
                        };

                        axios.post(`http://${GLOBAL_VARIABLES.LOCALHOST}/api/committee/delete-register`, options)
                            .then(response => {
                                if (response.status === 200) {
                                    const data = response.data;

                                    if (data) {
                                        const registers = data.registers;
                                        if (registers) {
                                            const newData = registers.map((element: any, index: number) => ({
                                                id: index + 1,
                                                name: element.name,
                                                operation: '',
                                                electoralId: element.electoralId,
                                                email: element.email,
                                                address: element.address,
                                                province: element.province,
                                                password: element.password,
                                                status: element.status,
                                                verification: element.verification,
                                                otp: element.otp,
                                                toast: toast,
                                                setData: setData
                                            }));

                                            setData([...newData]);

                                            toast({
                                                title: "Feedback",
                                                description: "Success! Citizen deleted."
                                            });
                                        }
                                    }
                                }
                            }).catch(_ => {
                                // console.error(error)
                                toast({
                                    title: "Feedback",
                                    description: "Error! Something went wrong."
                                });
                            });
                    }}>Remove</DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

        </>
    );
}