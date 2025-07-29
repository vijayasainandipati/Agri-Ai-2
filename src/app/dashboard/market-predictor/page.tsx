"use client";

import React, { useState, useTransition } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/language-context";
import { predictMarketPrice } from "@/lib/actions";
import type { MarketPricePredictorOutput } from "@/ai/flows/market-price-predictor";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export default function MarketPredictorPage() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<MarketPricePredictorOutput | null>(
    null
  );
  const { toast } = useToast();
  const { translate, language } = useLanguage();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setResult(null);

    startTransition(async () => {
      try {
        const res = await predictMarketPrice(formData);
        setResult(res);
      } catch (error) {
        console.error("Error predicting market prices:", error);
        toast({
          title: translate("toast.genericError.title"),
          description: translate("toast.marketPredictorError.description"),
          variant: "destructive",
        });
      }
    });
  };

  const chartConfig = {
    price: {
      label: translate("marketPredictor.priceLabel"),
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("marketPredictor.title")}
        </h1>
        <p className="text-muted-foreground mt-2">
          {translate("marketPredictor.description")}
        </p>
        <Card className="mt-6">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>{translate("marketPredictor.formTitle")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="language" value={language} />
              <div className="space-y-2">
                <Label htmlFor="cropName">{translate("marketPredictor.cropName")}</Label>
                <Input
                  id="cropName"
                  name="cropName"
                  placeholder={translate("marketPredictor.cropNamePlaceholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketName">{translate("marketPredictor.marketName")}</Label>
                <Input
                  id="marketName"
                  name="marketName"
                  placeholder={translate("marketPredictor.marketNamePlaceholder")}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {translate("marketPredictor.button")}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <div className="md:col-span-2">
        <h2 className="text-2xl font-bold font-headline mb-4">
          {translate("marketPredictor.resultsTitle")}
        </h2>
        <div className="space-y-6">
          {isPending && (
            <div className="space-y-6">
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-1/4 bg-muted rounded-md"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 w-3/4 bg-muted rounded-md"></div>
                </CardContent>
              </Card>
              <Card className="animate-pulse">
                <CardHeader>
                  <div className="h-6 w-1/3 bg-muted rounded-md"></div>
                </CardHeader>
                <CardContent>
                   <div className="h-64 w-full bg-muted rounded-md"></div>
                </CardContent>
              </Card>
            </div>
          )}

          {result ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{translate("marketPredictor.prediction")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.prediction}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>{translate("marketPredictor.priceTrend")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-video h-[250px] w-full"
                  >
                    <LineChart
                      data={result.priceData}
                      margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="week" tickLine={false} axisLine={false} tickMargin={8} />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        tickFormatter={(value) => `₹`}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator="dot" />}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="price"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={{
                          fill: "hsl(var(--primary))",
                        }}
                        activeDot={{
                          r: 6,
                        }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          ) : (
            !isPending && (
              <div className="flex flex-col items-center justify-center h-full min-h-64 border-2 border-dashed rounded-lg">
                <TrendingUp className="w-16 h-16 text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">
                  {translate("marketPredictor.resultsPlaceholder")}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
