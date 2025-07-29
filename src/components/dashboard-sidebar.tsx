
"use client";
import Link from "next/link";
import {
  Bot,
  CloudSun,
  HandCoins,
  LayoutDashboard,
  Leaf,
  Lightbulb,
  Newspaper,
  ScanSearch,
  TrendingUp,
} from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Icons } from "@/components/icons";
import { useLanguage } from "@/context/language-context";
import type { TranslationKey } from "@/lib/translations";

const menuItemsConfig = [
  { href: "/dashboard", labelKey: "menu.dashboard" as TranslationKey, icon: LayoutDashboard },
  { href: "/dashboard/crop-info", labelKey: "menu.cropInfo" as TranslationKey, icon: Leaf },
  { href: "/dashboard/crop-suggestion", labelKey: "menu.cropSuggestion" as TranslationKey, icon: Lightbulb },
  { href: "/dashboard/disease-detection", labelKey: "menu.diseaseDetection" as TranslationKey, icon: ScanSearch },
  { href: "/dashboard/weather-alerts", labelKey: "menu.weatherAlerts" as TranslationKey, icon: CloudSun },
  { href: "/dashboard/subsidies-loans", labelKey: "menu.subsidiesLoans" as TranslationKey, icon: HandCoins },
  { href: "/dashboard/market-predictor", labelKey: "menu.marketPredictor" as TranslationKey, icon: TrendingUp },
  { href: "/dashboard/kisan-assistant", labelKey: "menu.kisanAssistant" as TranslationKey, icon: Bot },
  { href: "/dashboard/news", labelKey: "menu.news" as TranslationKey, icon: Newspaper },
];

export function DashboardSidebar() {
  const { translate } = useLanguage();
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2">
          <Icons.logo className="w-8 h-8 text-primary" />
          <span className="font-headline text-xl font-semibold text-primary">
            AgriAI
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItemsConfig.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton tooltip={translate(item.labelKey)}>
                  <item.icon />
                  <span>{translate(item.labelKey)}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {/* Footer content can go here */}
      </SidebarFooter>
    </Sidebar>
  );
}
