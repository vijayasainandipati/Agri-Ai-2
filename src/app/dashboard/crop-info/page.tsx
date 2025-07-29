"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cropCategories, cropsData } from "@/lib/data";
import { useLanguage } from "@/context/language-context";
import type { TranslationKey } from "@/lib/translations";

export default function CropInfoPage() {
  const { translate } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("cropInfo.title")}
        </h1>
        <p className="text-muted-foreground">
          {translate("cropInfo.description")}
        </p>
      </div>

      <Tabs defaultValue={cropCategories[0].key} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
          {cropCategories.map((category) => (
            <TabsTrigger key={category.key} value={category.key}>
              {translate(category.nameKey as TranslationKey)}
            </TabsTrigger>
          ))}
        </TabsList>
        {cropCategories.map((category) => (
          <TabsContent key={category.key} value={category.key}>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {(cropsData[category.label] || []).map((crop) => {
                const cropName = translate(`crop.${crop.translationKey}.name` as TranslationKey);
                const cropDescription = translate(`crop.${crop.translationKey}.description` as TranslationKey);
                return (
                 <Link href={`/dashboard/crop-info/${crop.translationKey}`} key={crop.translationKey} className="flex">
                    <Card className="flex flex-col w-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                        <div className="relative aspect-video w-full mb-4">
                        <Image
                            src={crop.imageUrl}
                            alt={cropName}
                            fill
                            className="rounded-md object-cover"
                            data-ai-hint={crop.imageHint}
                        />
                        </div>
                        <CardTitle className="font-headline">{cropName}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground">{cropDescription}</p>
                    </CardContent>
                    </Card>
                 </Link>
                )
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}