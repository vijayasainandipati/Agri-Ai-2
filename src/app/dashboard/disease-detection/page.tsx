"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload } from "lucide-react";
import { detectCropDisease } from "@/lib/actions";
import type { DetectCropDiseaseOutput } from "@/ai/flows/detect-crop-disease";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function DiseaseDetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<DetectCropDiseaseOutput | null>(null);
  const { toast } = useToast();
  const { translate, language } = useLanguage();


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
        toast({ title: translate("toast.noFileError.title"), description: translate("toast.noFileError.description"), variant: "destructive" });
        return;
    };

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const photoDataUri = reader.result as string;
        const formData = new FormData();
        formData.append('photoDataUri', photoDataUri);
        formData.append('language', language);

        startTransition(async () => {
            try {
                const res = await detectCropDisease(formData);
                setResult(res);
            } catch (error) {
                console.error("Error detecting disease:", error);
                toast({
                    title: translate("toast.genericError.title"),
                    description: translate("toast.diseaseDetectionError.description"),
                    variant: "destructive"
                });
            }
        });
    };
    reader.onerror = (error) => {
        console.error("Error reading file:", error);
        toast({ title: translate("toast.fileReadError.title"), description: translate("toast.fileReadError.description"), variant: "destructive" });
    };
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("diseaseDetection.title")}
        </h1>
        <p className="text-muted-foreground">
          {translate("diseaseDetection.description")}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{translate("diseaseDetection.uploadTitle")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="picture" className="sr-only">{translate("diseaseDetection.uploadLabel")}</Label>
                <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} />
              </div>
              <Button onClick={handleSubmit} className="mt-4 w-full" disabled={!file || isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {translate("diseaseDetection.button")}
              </Button>
            </CardContent>
          </Card>
          {previewUrl && (
            <Card>
                <CardHeader>
                    <CardTitle>{translate("diseaseDetection.previewTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Image
                        src={previewUrl}
                        alt={translate("diseaseDetection.previewAlt")}
                        width={500}
                        height={500}
                        className="rounded-lg object-contain w-full"
                    />
                </CardContent>
            </Card>
          )}
        </div>
        
        <div>
            {isPending && (
                <Card className="animate-pulse">
                    <CardHeader>
                        <div className="h-8 w-3/4 bg-muted rounded-md"></div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="h-6 w-1/2 bg-muted rounded-md"></div>
                        <div className="h-4 w-full bg-muted rounded-md"></div>
                        <div className="h-4 w-full bg-muted rounded-md"></div>
                        <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                    </CardContent>
                </Card>
            )}
            {result ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline text-2xl">{translate("diseaseDetection.resultTitle")}</CardTitle>
                        <CardDescription>{translate("diseaseDetection.confidence")}: {(result.confidence * 100).toFixed(2)}%</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-semibold">{translate("diseaseDetection.diseaseName")}</h3>
                            <p className="text-muted-foreground">{result.diseaseName || 'N/A'}</p>
                        </div>
                        <div>
                            <h3 className="font-semibold">{translate("diseaseDetection.treatment")}</h3>
                            <p className="text-muted-foreground">{result.treatment || 'N/A'}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">{translate("diseaseDetection.fertilizer")}</h3>
                            <p className="text-muted-foreground">{result.fertilizerRecommendations || 'N/A'}</p>
                        </div>
                    </CardContent>
                </Card>
            ) : !isPending && (
                <div className="flex flex-col items-center justify-center h-full min-h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">{translate("diseaseDetection.resultPlaceholder")}</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

    