"use client";

import React, { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CloudDrizzle, CloudSun } from "lucide-react";
import { getWeatherAndIrrigationAlerts } from "@/lib/actions";
import type { WeatherAndIrrigationAlertsOutput } from "@/ai/flows/weather-irrigation-alerts";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";

export default function WeatherAlertsPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<WeatherAndIrrigationAlertsOutput | null>(null);
  const { toast } = useToast();
  const { translate, language } = useLanguage();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await getWeatherAndIrrigationAlerts(formData);
        setResult(res);
      } catch (error) {
        console.error("Error fetching weather alerts:", error);
        toast({
          title: translate("toast.genericError.title"),
          description: translate("toast.weatherError.description"),
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("weather.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {translate("weather.description")}
        </p>
        <Card className="mt-6">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{translate("weather.formTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="language" value={language} />
              <div className="space-y-2">
                <Label htmlFor="village">{translate("weather.village")}</Label>
                <Input id="village" name="village" placeholder={translate("weather.villagePlaceholder")} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cropType">{translate("weather.cropType")}</Label>
                <Input id="cropType" name="cropType" placeholder={translate("weather.cropTypePlaceholder")} required />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {translate("weather.button")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold font-headline mb-4">{translate("weather.alertsTitle")}</h2>
        <div className="space-y-6">
          {isPending && (
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="h-8 w-3/4 bg-muted rounded-md"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-6 w-1/2 bg-muted rounded-md"></div>
                    <div className="h-4 w-full bg-muted rounded-md"></div>
                    <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                </CardContent>
            </Card>
          )}

          {result ? (
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <CloudSun className="w-10 h-10 text-orange-400" />
                        <div>
                            <CardTitle className="font-headline">{translate("weather.weatherAlert")}</CardTitle>
                            <CardDescription>{translate("weather.forecast")}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>{result.weatherAlert}</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                        <CloudDrizzle className="w-10 h-10 text-blue-400" />
                        <div>
                            <CardTitle className="font-headline">{translate("weather.irrigationSchedule")}</CardTitle>
                             <CardDescription>{translate("weather.recommendations")}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p>{result.irrigationSchedule}</p>
                    </CardContent>
                </Card>
            </div>
          ) : !isPending && (
             <div className="flex flex-col items-center justify-center h-full min-h-64 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">{translate("weather.alertsPlaceholder")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
