import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Phone, KeyRound } from "lucide-react";

type LoginStep = "PHONE" | "CODE" | "SUCCESS";

export function LoginView() {
    const [step, setStep] = useState<LoginStep>("PHONE");
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [userName, setUserName] = useState("");

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            await invoke("login_request_code", { phone });
            setStep("CODE");
        } catch (err) {
            console.error(err);
            setError(typeof err === "string" ? err : "Failed to request code. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
        try {
            const name = await invoke<string>("login_sign_in", { code });
            setUserName(name);
            setStep("SUCCESS");
        } catch (err) {
            console.error(err);
            setError(typeof err === "string" ? err : "Failed to sign in. Check console.");
        } finally {
            setIsLoading(false);
        }
    };

    if (step === "SUCCESS") {
        return (
            <Card className="w-[350px] m-auto mt-20">
                <CardHeader>
                    <CardTitle>Welcome back!</CardTitle>
                    <CardDescription>You are signed in as {userName}</CardDescription>
                </CardHeader>
                <CardContent>
                    <Button className="w-full" onClick={() => setStep("PHONE")}>Log out (Stub)</Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-[350px] m-auto mt-20">
            <CardHeader>
                <CardTitle>{step === "PHONE" ? "Login to Telegram" : "Enter Code"}</CardTitle>
                <CardDescription>
                    {step === "PHONE"
                        ? "Enter your phone number to continue."
                        : `We sent a code to ${phone}.`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {step === "PHONE" ? (
                    <form onSubmit={handleRequestCode} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="phone"
                                    placeholder="+1234567890"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="pl-8"
                                    required
                                />
                            </div>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Send Code
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="code">Verification Code</Label>
                            <div className="relative">
                                <KeyRound className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="code"
                                    placeholder="12345"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    className="pl-8"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                            <Button type="button" variant="ghost" className="w-full" onClick={() => setStep("PHONE")} disabled={isLoading}>
                                Back
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}
