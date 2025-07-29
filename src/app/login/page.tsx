"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { useLanguage } from "@/context/language-context";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";
import type { FirebaseError } from 'firebase/app';


export default function LoginPage() {
  const { translate } = useLanguage();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  
  const [registerName, setRegisterName] = useState("");
  const [registerPhone, setRegisterPhone] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone || !loginPassword) return;
    setIsLoading(true);

    const email = `${loginPhone}@agriai.com`;

    try {
      await signInWithEmailAndPassword(auth, email, loginPassword);
      toast({
        title: translate("toast.loginSuccess.title"),
        description: translate("toast.loginSuccess.description"),
      });
      router.push("/dashboard");
    } catch (error) {
      const fbError = error as FirebaseError;
      console.error("Login error:", fbError.code);
      let description = translate("toast.loginError.description");
      if (fbError.code === 'auth/user-not-found' || fbError.code === 'auth/wrong-password' || fbError.code === "auth/invalid-credential") {
        description = translate("toast.loginError.invalidCredentials");
      }
      toast({
        title: translate("toast.loginError.title"),
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerPhone || !registerPassword) return;
    setIsLoading(true);

    const email = `${registerPhone}@agriai.com`;
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, registerPassword);
        
        await updateProfile(userCredential.user, {
            displayName: registerName,
            // We store the phone number in the photoURL as a workaround or use Firestore
        });

        toast({
            title: translate("toast.registerSuccess.title"),
            description: translate("toast.registerSuccess.description"),
        });
        router.push('/dashboard');

    } catch (error) {
        const fbError = error as FirebaseError;
        console.error("Registration error:", fbError.code);
        let description = translate("toast.registerError.description");
        if (fbError.code === 'auth/email-already-in-use') {
            description = translate("toast.registerError.alreadyExists");
        } else if (fbError.code === 'auth/weak-password') {
             description = translate("toast.registerError.weakPassword");
        }
        
        toast({
            title: translate("toast.registerError.title"),
            description: description,
            variant: 'destructive',
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="mx-auto max-w-sm w-full">
         <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Icons.logo className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-headline">{translate("login.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{translate("login.loginTab")}</TabsTrigger>
              <TabsTrigger value="register">{translate("login.registerTab")}</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
                <form onSubmit={handleLogin} className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="login-phone">{translate("login.phoneLabel")}</Label>
                        <Input
                        id="login-phone"
                        type="tel"
                        placeholder="10-digit number"
                        required
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="login-password">{translate("login.passwordLabel")}</Label>
                        <Input 
                            id="login-password" 
                            type="password" 
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {translate("login.loginButton")}
                    </Button>
              </form>
            </TabsContent>
            <TabsContent value="register">
                <form onSubmit={handleRegister} className="grid gap-4 pt-4">
                    <div className="grid gap-2">
                        <Label htmlFor="register-name">{translate("login.nameLabel")}</Label>
                        <Input
                        id="register-name"
                        type="text"
                        placeholder={translate("login.namePlaceholder")}
                        required
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="register-phone">{translate("login.phoneLabel")}</Label>
                        <Input
                        id="register-phone"
                        type="tel"
                        placeholder="10-digit number"
                        required
                        value={registerPhone}
                        onChange={(e) => setRegisterPhone(e.target.value)}
                        />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="register-password">{translate("login.passwordLabel")}</Label>
                        <Input 
                            id="register-password" 
                            type="password"
                            placeholder={translate("login.passwordPlaceholder")}
                            required
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)} 
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {translate("login.registerButton")}
                    </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
