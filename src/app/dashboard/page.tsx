"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bot,
  CloudSun,
  Leaf,
  Lightbulb,
  Newspaper,
  ScanSearch,
  ArrowRight,
  HandCoins,
  TrendingUp
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { TranslationKey } from "@/lib/translations";


interface Feature {
    titleKey: TranslationKey;
    descriptionKey: TranslationKey;
    buttonKey: TranslationKey;
    icon: React.ElementType;
    href: string;
    color: string;
}

const features: Feature[] = [
  {
    titleKey: "feature.cropInfo.title",
    descriptionKey: "feature.cropInfo.description",
    buttonKey: "feature.cropInfo.button",
    icon: Leaf,
    href: "/dashboard/crop-info",
    color: "text-green-500",
  },
  {
    titleKey: "feature.cropSuggestion.title",
    descriptionKey: "feature.cropSuggestion.description",
    buttonKey: "feature.cropSuggestion.button",
    icon: Lightbulb,
    href: "/dashboard/crop-suggestion",
    color: "text-yellow-500",
  },
  {
    titleKey: "feature.diseaseDetection.title",
    descriptionKey: "feature.diseaseDetection.description",
    buttonKey: "feature.diseaseDetection.button",
    icon: ScanSearch,
    href: "/dashboard/disease-detection",
    color: "text-red-500",
  },
  {
    titleKey: "feature.weatherAlerts.title",
    descriptionKey: "feature.weatherAlerts.description",
    buttonKey: "feature.weatherAlerts.button",
    icon: CloudSun,
    href: "/dashboard/weather-alerts",
    color: "text-blue-500",
  },
   {
    titleKey: "feature.subsidiesLoans.title",
    descriptionKey: "feature.subsidiesLoans.description",
    buttonKey: "feature.subsidiesLoans.button",
    icon: HandCoins,
    href: "/dashboard/subsidies-loans",
    color: "text-indigo-500",
  },
  {
    titleKey: "feature.marketPredictor.title",
    descriptionKey: "feature.marketPredictor.description",
    buttonKey: "feature.marketPredictor.button",
    icon: TrendingUp,
    href: "/dashboard/market-predictor",
    color: "text-cyan-500",
  },
  {
    titleKey: "feature.kisanAssistant.title",
    descriptionKey: "feature.kisanAssistant.description",
    buttonKey: "feature.kisanAssistant.button",
    icon: Bot,
    href: "/dashboard/kisan-assistant",
    color: "text-purple-500",
  },
  {
    titleKey: "feature.news.title",
    descriptionKey: "feature.news.description",
    buttonKey: "feature.news.button",
    icon: Newspaper,
    href: "/dashboard/news",
    color: "text-orange-500",
  },
];

export default function DashboardPage() {
  const { translate } = useLanguage();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("dashboard.welcome")}
        </h1>
        <p className="text-muted-foreground">
          {translate("dashboard.description")}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.href} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <CardTitle className="text-xl font-headline flex items-center gap-2">
                        <feature.icon className={`w-6 h-6 ${feature.color}`} />
                        {translate(feature.titleKey)}
                    </CardTitle>
                    <CardDescription>{translate(feature.descriptionKey)}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-grow flex items-end">
              <Link href={feature.href} className="w-full">
                <Button variant="outline" className="w-full">
                  <span>{translate(feature.buttonKey)}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
