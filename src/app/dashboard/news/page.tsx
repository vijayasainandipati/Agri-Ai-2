"use client";

import React, { useState, useTransition, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Newspaper } from 'lucide-react';
import { getAgriculturalNews } from '@/lib/actions';
import type { AgriculturalNewsOutput } from '@/ai/flows/agricultural-news-feed';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/language-context';

export default function NewsPage() {
  const [region, setRegion] = useState('India');
  const [isPending, startTransition] = useTransition();
  const [news, setNews] = useState<AgriculturalNewsOutput | null>(null);
  const { toast } = useToast();
  const { translate, language } = useLanguage();

  const fetchNews = (regionName: string) => {
    const formData = new FormData();
    formData.append('region', regionName);
    formData.append('language', language);
    startTransition(async () => {
      try {
        const result = await getAgriculturalNews(formData);
        setNews(result);
      } catch (error) {
        console.error('Error fetching news:', error);
        toast({
          title: translate("toast.genericError.title"),
          description: translate("toast.newsError.description"),
          variant: 'destructive',
        });
      }
    });
  };
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    fetchNews(region);
  };
  
  // Fetch news on initial load
  useEffect(() => {
    fetchNews('India');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("news.title")}
        </h1>
        <p className="text-muted-foreground">
          {translate("news.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <form onSubmit={handleSubmit} className="flex items-center gap-4">
             <input type="hidden" name="language" value={language} />
            <Input
              name="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder={translate("news.placeholder")}
              className="max-w-xs"
            />
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {translate("news.button")}
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {isPending && [...Array(5)].map((_, i) => (
                <li key={i} className="flex items-start gap-4 p-2 animate-pulse">
                    <div className="flex-shrink-0 h-6 w-6 bg-muted rounded-full"></div>
                    <div className="flex-1 h-5 bg-muted rounded-md"></div>
                </li>
            ))}
            {news && news.newsItems.map((item, index) => (
              <li key={index} className="flex items-start gap-4 p-2 hover:bg-muted/50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm">{item}</p>
              </li>
            ))}
             {!isPending && !news && (
                <div className="flex flex-col items-center justify-center h-full min-h-64 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">{translate("news.articlesPlaceholder")}</p>
                </div>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

    