"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useLanguage } from "@/context/language-context";
import { cropsData } from "@/lib/data";
import type { TranslationKey } from "@/lib/translations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const allCrops = Object.values(cropsData).flat();

export default function CropDetailPage() {
  const params = useParams();
  const { translate } = useLanguage();
  const cropKey = params.cropKey as string;

  const crop = allCrops.find((c) => c.translationKey === cropKey);

  if (!crop) {
    notFound();
  }

  const cropName = translate(`crop.${crop.translationKey}.name` as TranslationKey);
  const cropDescription = translate(`crop.${crop.translationKey}.description` as TranslationKey);
  const howToGrow = translate(`crop.${crop.translationKey}.howToGrow` as TranslationKey);

  // Fallback for the title if the key is missing
  const pageTitle = translate("cropInfoDetail.title", "Details for {cropName}").replace('{cropName}', cropName);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="outline" size="sm">
          <Link href="/dashboard/crop-info">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {translate("cropInfoDetail.backButton")}
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        <div className="space-y-2">
            <h1 className="text-4xl font-bold font-headline tracking-tight">{pageTitle}</h1>
            <p className="text-lg text-muted-foreground">{cropDescription}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <Image
              src={crop.imageUrl}
              alt={cropName}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full aspect-video"
              data-ai-hint={crop.imageHint}
            />
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">
                  {translate("cropInfoDetail.howToGrow")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground whitespace-pre-line">
                {howToGrow}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}