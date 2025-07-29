"use client"

import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LanguageSelector } from '@/components/language-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/context/language-context';

export default function SettingsPage() {
    const { logout } = useAuth();
    const { translate } = useLanguage();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    {translate("settings.title")}
                </h1>
                <p className="text-muted-foreground">
                    {translate("settings.description")}
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>{translate("settings.appearanceTitle")}</CardTitle>
                    <CardDescription>{translate("settings.appearanceDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label>{translate("settings.languageLabel")}</Label>
                        <LanguageSelector />
                    </div>
                     <div className="flex items-center justify-between">
                        <Label>{translate("settings.themeLabel")}</Label>
                        <ThemeToggle />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>{translate("settings.notificationsTitle")}</CardTitle>
                    <CardDescription>{translate("settings.notificationsDescription")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <Label htmlFor="push-notifications" className='cursor-pointer'>{translate("settings.pushLabel")}</Label>
                        <Switch id="push-notifications" />
                    </div>
                     <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
                        <Label htmlFor="email-notifications" className='cursor-pointer'>{translate("settings.emailLabel")}</Label>
                        <Switch id="email-notifications" defaultChecked />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{translate("settings.accountTitle")}</CardTitle>
                    <CardDescription>{translate("settings.accountDescription")}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="destructive" onClick={logout}>
                        {translate("settings.logoutButton")}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
