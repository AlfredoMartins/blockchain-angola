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
import { uploadImage } from "@/services/firebase";
import { GLOBAL_VARIABLES } from "@/global/globalVariables";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/data_types";

const formSchema = z.object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    username: z.string().min(1, { message: "Username cannot be empty" }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    photoFile: z.any().optional(),
    role: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // path of error
});

export type FormValues = z.infer<typeof formSchema>;

type CitizenFormProps = {
    onSubmitForm: (data: FormValues) => void;
    defaultValues?: Partial<FormValues>;
    mode?: "create" | "update";
}

export const UserForm: React.FC<CitizenFormProps> = ({
    defaultValues,
    onSubmitForm,
    mode,
}) => {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
        defaultValues: {
            ...defaultValues,
            password: '',
            confirmPassword: '',
            photoFile: null
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
                                    <Input placeholder="Enter your name..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    {
                                        mode === "update"
                                            ? <Input placeholder="Username" autoComplete="username"  {...field} readOnly />
                                            : <Input placeholder="Username" autoComplete="username"  {...field} />
                                    }
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" autoComplete="new-password" placeholder="Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" autoComplete="new-password" placeholder="Confirm Password" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="photoFile"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {"Photo " + (mode === "update" ? "(Optional)" : "")}
                                </FormLabel>

                                <FormControl>
                                    <Input type="file"
                                        onChange={(event) => {
                                            field.onChange(event.target.files[0]);
                                        }} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="role"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose the status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="admin">Admin</SelectItem>
                                            <SelectItem value="normal">Normal</SelectItem>
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

type UserModalProps = {
    isOpen: boolean;
    onOpenChange: (e: boolean) => void;
    defaultValues?: any;
    mode: boolean;
    toast: (...params: any[]) => void;
    setData: any;
}

export const UserModal = ({ isOpen, onOpenChange, defaultValues, mode, toast, setData }: UserModalProps) => {
    const { imageList, setImageList, updateImages } = useAuth();

    const updateUser = async (data: FormValues) => {
        try {
            const userPhotoName = data.name.toLowerCase().split(' ').join('.');
            uploadImage(data.photoFile, userPhotoName, setImageList);

            const response = await api.post("/committee/update-user", data);
            const users = response.data.users as User[];

            if (users) {

                const newData = users.map((element: any, index: number) => {
                    const userPhoto = element.name.toLowerCase().split(' ').join('.');
        
                    return ({
                      id: index + 1,
                      name: element.name,
                      username: element.username,
                      password: element.password,
                      role: parseInt(element.role) === 0 ? "admin" : "normal",
                      photo: imageList ? imageList[userPhoto] ?? 'default': '',
                      refreshToken: element.refreshToken,
                      timestamp: new Date(element.timestamp).toLocaleString(),
                      setData: setData,
                      toast: toast
                    });
                  });
                
                updateImages();
                setData([...newData]);
                onOpenChange(false);
            }
        } catch (error) {

            toast({
                title: "Feedback",
                description: "Error! Something went wrong."
            });

        }
    }

    const addUser = async (data: any) => {
        try {

            const userPhotoName = data.name.toLowerCase().split(' ').join('.');
            uploadImage(data.photoFile, userPhotoName, setImageList);
            
            const URL = 'http://' + GLOBAL_VARIABLES.LOCALHOST + '/api/committee/add-user';

            const body = {
                name: data.name,
                username: data.username,
                password: data.password,
                role: data.role
            };

            const response = await axios.post(URL, body);
            const statusCode = response.status;

            if (statusCode === 200) {
                const users = response.data.users;
                if (users !== undefined) {
                    const newData = users.map((element: any, index: number) => {
                        const userPhoto = element.name.toLowerCase().split(' ').join('.');
            
                        return ({
                          id: index + 1,
                          name: element.name,
                          username: element.username,
                          password: element.password,
                          role: parseInt(element.role) === 0 ? "admin" : "normal",
                          photo: imageList ? imageList[userPhoto] ?? 'default': '',
                          refreshToken: element.refreshToken,
                          timestamp: new Date(element.timestamp).toLocaleString(),
                          setData: setData,
                          toast: toast
                        });
                      });
                    
                    updateImages();
                    setData([...newData]);
                    onOpenChange(false);
                }
            }
        } catch (error) {
            toast({
                title: "Feedback",
                description: "Error! Something went wrong."
            });
        }
    }

    const onSubmitForm = (data: FormValues) => {
        if (mode) {
            addUser(data);
        } else {
            updateUser(data);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange} >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle> {mode ? "Add User" : "Edit User"}</DialogTitle>
                </DialogHeader>
                <UserForm onSubmitForm={onSubmitForm} defaultValues={defaultValues} />
            </DialogContent>
        </Dialog>
    )
}