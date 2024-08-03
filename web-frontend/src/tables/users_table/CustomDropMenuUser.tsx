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

import axios from 'axios';
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { UserModal } from './operation-user';
import { GLOBAL_VARIABLES } from '@/global/globalVariables';
import { User } from '@/data_types';

type CustomDropMenuProps = {
    user: User
}

export default function CustomDropMenuUser({ user }: CustomDropMenuProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    return (
        <>
            <UserModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} defaultValues={user} setData={user.setData} mode={false} toast={user.toast}/>
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
                        onClick={() => navigator.clipboard.writeText(JSON.stringify(user).toString())}
                    >
                        Copy row data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsModalOpen(true)}> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                        const username = user.username;
                        const toast = user.toast;
                        const setData = user.setData;

                        const options = {
                            username: username
                        };

                        axios.post(`http://${GLOBAL_VARIABLES.LOCALHOST}/api/committee/delete-user`, options)
                            .then(response => {
                                if (response.status === 200) {
                                    const data = response.data;
                                    // console.log("Success response:", data);

                                    if (data.users !== undefined) {
                                        const users = data.users;

                                        const newData = users.map((element: any, index: number) => ({
                                            id: index + 1,
                                            name: element.name,
                                            username: element.username,
                                            password: element.password,
                                            photo: element.photo,
                                            refreshToken: element.refreshToken,
                                            timestamp: new Date(element.timestamp).toLocaleString(),
                                            toast: toast,
                                            setData: setData
                                        }));

                                        setData([...newData]);

                                        user.toast({
                                            title: "Feedback",
                                            description: "Success! User deleted."
                                        });

                                        return;
                                    }

                                    user.toast({
                                        title: "Feedback",
                                        description: "Error! Something went wrong."
                                    });

                                }
                            }).catch(error => {
                                console.error(error)
                                user.toast({
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