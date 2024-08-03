/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { SubmitHandler, useForm } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import axios from "axios";

import { Input } from "@/components/ui/input"
import { uploadImage } from "@/services/firebase";
import { useAuth } from "@/context/AuthContext";
import { GLOBAL_VARIABLES } from "@/global/globalVariables";

const formSchema = z.object({
    name: z.string(),
    code: z.string().refine((val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
    }, {
        message: "Code must be a number greater than 0"
    }),
    partyImageFile: z.any().optional(),
    candidatePhotoFile: z.any().optional(),
    party: z.string(),
    status: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

type CitizenFormProps = {
    onSubmitForm: (data: FormValues) => void;
    defaultValues?: Partial<FormValues>;
    mode?: "create" | "update";
}

export const CandidateForm: React.FC<CitizenFormProps> = ({
    defaultValues,
    onSubmitForm,
    mode,
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            ...defaultValues,
            partyImageFile: null,
            candidatePhotoFile: null
        }
    });

    const onSubmit: SubmitHandler<FormValues> = (formData) => {
        onSubmitForm(formData);
    };

    return (
        <Form {...form}>
            <div className="grid gap-4">
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Candidate name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Code</FormLabel>
                                <FormControl>
                                    {
                                        mode === "update"
                                            ? <Input placeholder="Candidate code" {...field} readOnly />
                                            : <Input placeholder="Candidate code" {...field} />
                                    }
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="party"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Party</FormLabel>
                                <FormControl>
                                    <Input placeholder="Party name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="candidatePhotoFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {"Candidate Photo " + (mode === "update" ? "(Optional)" : "")}
                                </FormLabel>

                                <FormControl>
                                    <Input type="file" onChange={(event) => {
                                        field.onChange(event.target.files[0]);
                                    }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="partyImageFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {"Party Image " + (mode === "update" ? "(Optional)" : "")}
                                </FormLabel>
                                <FormControl>
                                    <Input type="file" onChange={(event) => {
                                        field.onChange(event.target.files[0]);
                                    }} />

                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="status"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a status of the candidade..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="failed">Failed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="self-center w-32">
                        Save
                    </Button>

                </form>
            </div>
        </Form>
    )
}

const getAcronym = (str: string) => {
    const acronym = str.toUpperCase().split(' ').map(x => x[0]).join('');
    return acronym;
}

type CandidadeModalProps = {
    isOpen: boolean;
    onOpenChange: (e: boolean) => void;
    defaultValues?: any;
    mode: boolean;
    toast: (...params: any[]) => void;
    setData: any;
}

export const CandidadeModal = ({ isOpen, onOpenChange, defaultValues, mode, toast, setData }: CandidadeModalProps) => {
    const { imageList, setImageList, updateImages } = useAuth();

    const addCandidate = async (data) => {

        const candidatePhotoName = data.name.toLowerCase().split(' ').join('.');
        const partyPhotoName = data.party.toLowerCase().split(' ').join('.');

        console.log("cand: ", data.candidatePhotoFile, " | ", candidatePhotoName);
        console.log("part: ", data.partyImageFile, " | ", partyPhotoName);

        uploadImage(data.candidatePhotoFile, candidatePhotoName, setImageList);
        uploadImage(data.partyImageFile, partyPhotoName, setImageList);


        const URL = 'http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/add-candidate';

        const body = {
            code: data.code,
            name: data.name,
            party: data.party,
            acronym: getAcronym(data.party),
            status: data.status,
        };

        const response = await axios.post(URL, body);
        const statusCode = response.status;

        if (statusCode === 200) {
            const candidates = response.data.candidates;

            const newData = candidates.map((element: any, index: number) => {
                const candidateName = element.name.toLowerCase().split(' ').join('.');
                const partyName = element.party.toLowerCase().split(' ').join('.');

                return ({
                    id: index + 1,
                    code: element.code,
                    name: element.name,
                    acronym: element.acronym,
                    candidadePhoto: imageList[candidateName] ?? 'default',
                    partyImage: imageList[partyName] ?? 'default',
                    party: element.party,
                    status: element.status
                })
            });

            updateImages();
            setData([...newData]);
            onOpenChange(false);
        } else {
            toast({
                title: "Feedback",
                description: "Error! Something went wrong."
            });
        }
    }

    const updateCandidate = async (data) => {

        const candidatePhotoName = data.name.toLowerCase().split(' ').join('.');
        const partyPhotoName = data.party.toLowerCase().split(' ').join('.');

        console.log("cand: ", data.candidatePhotoFile, " | ", candidatePhotoName);
        console.log("part: ", data.partyImageFile, " | ", partyPhotoName);

        uploadImage(data.candidatePhotoFile, candidatePhotoName, setImageList);
        uploadImage(data.partyImageFile, partyPhotoName, setImageList);

        const URL = 'http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/add-candidate';

        const body = {
            code: data.code,
            name: data.name,
            party: data.party,
            acronym: getAcronym(data.party),
            status: data.status
        };

        const response = await axios.post(URL, body);
        const statusCode = response.status;

        if (statusCode === 200) {
            const candidates = response.data.candidates;

            const newData = candidates.map((element: any, index: number) => {
                const candidateName = element.name.toLowerCase().split(' ').join('.');
                const partyName = element.party.toLowerCase().split(' ').join('.');

                return ({
                    id: index + 1,
                    code: element.code,
                    name: element.name,
                    acronym: element.acronym,
                    candidadePhoto: imageList[candidateName],
                    partyImage: imageList[partyName],
                    party: element.party,
                    status: element.status
                })
            });

            updateImages();
            setData([...newData]);
            onOpenChange(false);

            toast({
                title: "Feedback",
                description: "Success! Candidate added."
            });

        } else {
            toast({
                title: "Feedback",
                description: "Error! Something went wrong."
            });
        }
    }

    const onSubmitForm = (data: FormValues) => {
        if (mode) {
            addCandidate(data);
        } else {
            updateCandidate(data);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {mode ? "Add Candidade" : "Edit Candidate"}</DialogTitle>
                </DialogHeader>
                <CandidateForm onSubmitForm={onSubmitForm} defaultValues={defaultValues} mode={mode ? "create" : "update"} />
            </DialogContent>
        </Dialog>
    )
}