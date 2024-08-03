import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface ErrorHash {
    username: string,
    password?: string,
}

export function LoginAccountCard() {
    // ==== FIELDS ====
    const [username, setUsername] = useState<string>("")
    const [password, setPassword] = useState<string>("");
    // ==== END FIELDS ====

    const { authState, onLogin } = useAuth();

    const [errors, setErrors] = useState<ErrorHash>({});

    const resetValues = () => {
        setUsername("");
        setPassword("");
        setErrors({});
    }

    const navigate = useNavigate();

    const formValidation = () => {
        let errorHash: ErrorHash = {};

        if (!username) errorHash.username = "Username required.";
        if (!password) errorHash.password = "Password required.";

        setErrors(errorHash);
        return Object.keys(errorHash).length === 0;
    }

    // Redirect to /new-page when this component is rendered

    const onClickLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault(); // Prevent page refresh        console.log("Submmit pressed ... ", username, password);

        if (formValidation()) {
            resetValues();

            const result = await onLogin!(username, password);
            if (result && result.error) {
                navigate('/', { replace: true });
            } else if (authState?.authenticated) {
                navigate('/dashboard');
            }

        } else {
            console.log("Failed to validate!");
        }
    }

    useEffect(() => {
        setUsername("julia.martins");
        setPassword("financas#034?");
    }, []);

    return (
        <div>
            <form>
                <Card className="w-[400px]" >
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="space-y-1" style={{ opacity: 1}}>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" defaultValue={username}
                                onChange={event => setUsername(event.target.value)}
                            />
                        </div>
                        {errors.username ? <span style={styles.errorText}>{errors.username}</span> : null}
                        <div className="space-y-1" style={{ opacity: 1}}>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" defaultValue={password} autoComplete="shipping current-password webauthn"
                                onChange={event => setPassword(event.target.value)}
                            />
                        </div>
                        {errors.password ? <div style={styles.errorText}>{errors.password}</div> : null}
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button onClick={onClickLogin} style={{ opacity: 1 }}><span className="p-16">Login</span></Button>
                    </CardFooter>
                </Card>

            </form>
        </div>
    )
}

const styles = {
    errorText: {
        color: 'red',
        marginBottom: 5,
    }
};