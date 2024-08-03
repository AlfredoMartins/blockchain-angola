/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { GLOBAL_VARIABLES, TOKEN_KEY } from "@/global/globalVariables";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import axios from 'axios';
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
import { getItemAsync } from "@/context/SecureStore";
import { Voter } from "@/data_types";

function TableVoters({ toast }: { toast: (...params: any[]) => void }) {
    const [data, setData] = useState<Voter[]>([]);

    useEffect(() => {
        onPressLoadIdentifiers();
    }, []); 

    const removeExtraEquals = (str: string): string => {
        if (str.substring(0, str.length - 2) !== "==") {
            return str;
        }
        return str.substring(0, str.length - 2); // Removes the extra ==
    }

    const onPressGenerateIdentifiers = async () => {
        const token = await getItemAsync(TOKEN_KEY);
        axios.defaults.withCredentials = true;
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
        axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/generate-identifiers', { withCredentials: true })
            .then(response => {
                const votersGenerated = response.data.voters;
                const newData = votersGenerated.map((element: any, index: number) => ({
                    id: index + 1,
                    identifier: removeExtraEquals(element.identifier),
                    electoralId: removeExtraEquals(element.electoralId),
                    choiceCode: element.choiceCode,
                    state: element.state ? "true" : "false",
                    secret: element.secret,
                }));

                setData([...newData]);
            })
            .catch(error => console.error(error));
    }

    const onPressDeployBlockchain = () => {
        axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/deploy-voters')
            .then(response => {
                const votersGenerated = response.data.voters;
                const newData = votersGenerated.map((element: any, index: number) => ({
                    id: index + 1,
                    identifier: removeExtraEquals(element.identifier),
                    electoralId: removeExtraEquals(element.electoralId),
                    choiceCode: element.choiceCode,
                    state: element.state ? "true" : "false",
                    secret: element.secret,
                }));

                setData([...newData]);

                toast({
                    title: "Feedback",
                    description: "Success! Data deployed successfully ..."
                });
            })
            .catch(error => {
                toast({
                    title: "Feedback",
                    description: "Error! Something went wrong."
                });
                console.error(error);
            });
    }

    const openDialog = () => {
        return <AlertDialog>
            <AlertDialogTrigger asChild>
                <span className="max-w-lg inline-block text-md bg-green-900 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800">Deploy to Blockchain</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently erase all data stored in the smart-contract and register the new data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction><Button onClick={onPressDeployBlockchain}>Continue</Button></AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>;
    }

    const onPressLoadIdentifiers = () => {
        axios.get('http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/blockchain/voters')
            .then(response => {
                const voters = response.data.voters;

                if (voters) {
                    const newData = voters.map((element: any, index: number) => ({
                        id: index + 1,
                        identifier: removeExtraEquals(element.identifier),
                        electoralId: removeExtraEquals("*******"),
                        choiceCode: element.choiceCode,
                        state: element.state ? "true" : "false",
                        secret: element.secret,
                    }));
                    
                    setData([...newData]);
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <section>
            <div className="flex gap-2 py-4">
                <Button className="max-w-lg" onClick={onPressGenerateIdentifiers}>Generate Identifiers</Button>
                <Button className="max-w-lg" onClick={onPressLoadIdentifiers}>Load Identifiers</Button>
                {openDialog()}
            </div>
            <DataTable columns={columns} data={data} />
        </section>
    );
}

export default TableVoters;