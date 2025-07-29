"use client";

import React, { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { CropSuggestionOutput } from "@/ai/flows/crop-suggestion-based-on-location";
import { suggestCropsBasedOnLocation } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { cropsData } from "@/lib/data";
import { useLanguage } from "@/context/language-context";
import { translations, type TranslationKey } from "@/lib/translations";

const allCropsData = Object.values(cropsData).flat();
const englishTranslations = translations.English;

// Create a lookup map from english crop name to image url
const englishNameToImageMap = new Map<string, string>(
  allCropsData.map(crop => {
      const englishName = englishTranslations[`crop.${crop.translationKey}.name` as TranslationKey] || '';
      return [englishName.toLowerCase(), crop.imageUrl];
  })
);

// Create a lookup map from english crop name to its translation key
const englishNameToTranslationKeyMap = new Map<string, string>(
  allCropsData.map(crop => {
      const englishName = englishTranslations[`crop.${crop.translationKey}.name` as TranslationKey] || '';
      return [englishName.toLowerCase(), crop.translationKey];
  })
);


export default function CropSuggestionPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<CropSuggestionOutput | null>(null);
  const { toast } = useToast();
  const { translate, language } = useLanguage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setResult(null);

    startTransition(async () => {
      try {
        const res = await suggestCropsBasedOnLocation(formData);
        setResult(res);
      } catch (error) {
        console.error("Error suggesting crops:", error);
        toast({
            title: translate("toast.genericError.title"),
            description: translate("toast.cropSuggestionError.description"),
            variant: "destructive"
        })
      }
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("cropSuggestion.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {translate("cropSuggestion.description")}
        </p>
        <Card className="mt-6">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{translate("cropSuggestion.formTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <input type="hidden" name="language" value={language} />
              <div className="space-y-2">
                <Label htmlFor="country">{translate("cropSuggestion.country")}</Label>
                <Input id="country" name="country" placeholder={translate("cropSuggestion.countryPlaceholder")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">{translate("cropSuggestion.region")}</Label>
                <Input id="region" name="region" placeholder={translate("cropSuggestion.regionPlaceholder")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">{translate("cropSuggestion.season")}</Label>
                <Select name="season" required>
                  <SelectTrigger>
                    <SelectValue placeholder={translate("cropSuggestion.seasonPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spring">{translate("seasons.spring")}</SelectItem>
                    <SelectItem value="Summer">{translate("seasons.summer")}</SelectItem>
                    <SelectItem value="Monsoon">{translate("seasons.monsoon")}</SelectItem>
                    <SelectItem value="Autumn">{translate("seasons.autumn")}</SelectItem>
                    <SelectItem value="Winter">{translate("seasons.winter")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weatherDescription">{translate("cropSuggestion.weather")}</Label>
                <Input id="weatherDescription" name="weatherDescription" placeholder={translate("cropSuggestion.weatherPlaceholder")} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {translate("cropSuggestion.button")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold font-headline mb-4">{translate("cropSuggestion.suggestionsTitle")}</h2>
        <div className="space-y-6">
          {isPending && (
             <div className="grid md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader>
                             <div className="relative aspect-video w-full bg-muted rounded-md"></div>
                        </CardHeader>
                        <CardContent className="space-y-3 pt-6">
                            <div className="h-6 w-1/2 bg-muted rounded-md"></div>
                            <div className="h-4 w-full bg-muted rounded-md"></div>
                            <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                            <div className="h-4 w-full bg-muted rounded-md"></div>
                        </CardContent>
                    </Card>
                ))}
             </div>
          )}

          {result && result.suggestedCrops.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6">
              {result.suggestedCrops.map((crop, index) => {
                const cropNameLower = crop.cropName.toLowerCase();
                const imageUrl = englishNameToImageMap.get(cropNameLower) || `https://placehold.co/400x225.png`;
                const translationKey = englishNameToTranslationKeyMap.get(cropNameLower);
                const displayName = translationKey ? translate(`crop.${translationKey}.name` as TranslationKey) : crop.cropName;
                const imageHint = allCropsData.find(c => c.translationKey === translationKey)?.imageHint || 'placeholder';

                return (
                  <Card key={index}>
                    <CardHeader>
                      <Image
                        src={imageUrl}
                        alt={displayName}
                        width={400}
                        height={225}
                        className="rounded-md object-cover w-full aspect-video"
                        data-ai-hint={imageHint}
                      />
                      <CardTitle className="pt-4 font-headline">{displayName}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <p><strong>{translate("cropSuggestion.plantingTime")}:</strong> {crop.plantingTime}</p>
                      <p><strong>{translate("cropSuggestion.soilType")}:</strong> {crop.soilType}</p>
                      <p><strong>{translate("cropSuggestion.yieldInfo")}:</strong> {crop.yieldInfo}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          
          {!isPending && !result && (
            <div className="flex flex-col items-center justify-center h-full min-h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">{translate("cropSuggestion.suggestionsPlaceholder")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

    