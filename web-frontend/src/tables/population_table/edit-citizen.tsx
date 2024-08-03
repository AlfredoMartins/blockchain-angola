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
import { Input } from "@/components/ui/input";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { api } from '../../services/api';
import { useToast } from "@/components/toast/use-toast";
import { Citizen } from "@/data_types";

const provinces = [
    "Bengo",
    "Benguela",
    "Bié",
    "Cabinda",
    "Cuando Cubango",
    "Cuanza Norte",
    "Cuanza Sul",
    "Cunene",
    "Huambo",
    "Huíla",
    "Luanda",
    "Lunda Norte",
    "Lunda Sul",
    "Malanje",
    "Moxico",
    "Namibe",
    "Uíge",
    "Zaire"
];

const formSchema = z.object({
    name: z.string(),
    electoralId: z.string().optional(),
    email: z.string().email("Invalid e-mail."),
    address: z.string(),
    province: z.string(),
    status: z.string(),
});

export type FormValues = z.infer<typeof formSchema>;

type CitizenFormProps = {
    onSubmitForm: (data: FormValues) => void;
    defaultValues?: Partial<FormValues>;
    mode?: "create" | "update";
}

export const CitizenForm: React.FC<CitizenFormProps> = ({
    defaultValues,
    onSubmitForm,
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues,
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
                                    <Input placeholder="Your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="electoralId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Electoral Number</FormLabel>
                                <FormControl>
                                    <Input placeholder="Electoral ID" {...field} readOnly />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail</FormLabel>
                                <FormControl>
                                    <Input placeholder="E-mail" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="province"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose the option." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {provinces.map((province, index) => (
                                                <SelectItem key={index} value={province}>
                                                    {province}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>
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
                                            <SelectValue placeholder="Pick an option" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="failed">Failed</SelectItem>
                                            <SelectItem value="processing">Processing</SelectItem>
                                            <SelectItem value="verified">Verified</SelectItem>
                                            <SelectItem value="pending">Pending</SelectItem>
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

type EditCitizenModalProps = {
    isOpen: boolean;
    onOpenChange: (e: boolean) => void;
    defaultValues?: any;
    setData: any;
    toast: (...params: any[]) => void;
}

export const EditCitizenModal = ({ isOpen, onOpenChange, defaultValues, setData, toast }: EditCitizenModalProps) => {

    const updateCitizen = async (data: FormValues) => {
        try {
            const response = await api.post("/committee/update-citizen", data);
            const registers = response.data.registers as Citizen[];

            if (registers) {
                let newData = registers.map((element: any) => ({
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

                newData.sort((a, b) => {
                    const nameA = a.name.toLowerCase();
                    const nameB = b.name.toLowerCase();
                    if (nameA < nameB) return -1;
                    if (nameA > nameB) return 1;
                    return 0;
                });

                newData = newData.map((element: any, index: number) => ({
                    id: index + 1,
                    ...element
                }));

                setData([...newData]);

                onOpenChange(false);
            }
        } catch (error) {
            // console.error(error);
            toast({
                title: "Feedback",
                description: "Error! Something went wrong."
            });
        }
    }
    const onSubmitForm = (data: FormValues) => {
        updateCitizen(data);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Citizen</DialogTitle>
                </DialogHeader>
                <CitizenForm onSubmitForm={onSubmitForm} defaultValues={defaultValues} />
            </DialogContent>
        </Dialog>
    );
}