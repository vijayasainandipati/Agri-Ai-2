"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function ProfilePage() {
  const { user, loading, setUser } = useAuth();
  const { toast } = useToast();
  const { translate } = useLanguage();
  
  const [displayName, setDisplayName] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const phoneNumber = user?.email?.split('@')[0];

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoPreviewUrl(user.photoURL);
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setIsSubmitting(true);

    try {
      let photoURL = auth.currentUser.photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `profile_pictures/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }
      
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });

      // Manually update user in context to reflect changes immediately
      if (user) {
        const updatedUser = { ...user, displayName, photoURL };
        setUser(updatedUser as any);
      }

      toast({
        title: translate("toast.profileUpdateSuccess.title"),
        description: translate("toast.profileUpdateSuccess.description"),
      });

    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        title: translate("toast.genericError.title"),
        description: translate("toast.profileUpdateError.description"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
     return (
      <div className="space-y-6 animate-pulse">
        <div>
          <div className="h-8 w-1/3 bg-muted rounded-md"></div>
          <div className="h-4 w-2/3 bg-muted rounded-md mt-2"></div>
        </div>
        <Card>
            <CardHeader>
                <div className="h-6 w-1/4 bg-muted rounded-md"></div>
                <div className="h-4 w-1/2 bg-muted rounded-md mt-1"></div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-full bg-muted"></div>
                  <div className='space-y-2'>
                      <div className="h-10 w-24 bg-muted rounded-md"></div>
                      <div className="h-3 w-32 bg-muted rounded-md"></div>
                  </div>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted rounded-md"></div>
                    <div className="h-10 w-full bg-muted rounded-md"></div>
                </div>
                 <div className="space-y-2">
                    <div className="h-4 w-40 bg-muted rounded-md"></div>
                    <div className="h-10 w-full bg-muted rounded-md"></div>
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 flex justify-end">
                <div className="h-10 w-28 bg-muted rounded-md"></div>
            </CardFooter>
        </Card>
    </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("profile.title")}
        </h1>
        <p className="text-muted-foreground">
          {translate("profile.description")}
        </p>
      </div>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>{translate("profile.editTitle")}</CardTitle>
            <CardDescription>{translate("profile.editDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={photoPreviewUrl || undefined} alt={translate("profile.avatarAlt")} />
                <AvatarFallback>{displayName?.charAt(0).toUpperCase() || 'F'}</AvatarFallback>
              </Avatar>
              <div>
                <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  {translate("profile.uploadButton")}
                </Button>
                <Input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/png, image/jpeg, image/gif"
                  onChange={handleFileChange}
                />
                <p className="text-xs text-muted-foreground mt-2">{translate("profile.uploadHint")}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">{translate("profile.nameLabel")}</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder={translate("profile.namePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{translate("profile.phoneLabel")}</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber || ''}
                disabled
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4 flex justify-end">
             <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {translate("profile.saveButton")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

    