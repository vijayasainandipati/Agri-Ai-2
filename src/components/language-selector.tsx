
"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/context/language-context";
import { Languages } from "lucide-react";

const languages = [
  "English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", 
  "Bengali", "Gujarati", "Marathi", "Urdu"
];

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-auto h-9 gap-2">
        <Languages className="h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang} value={lang}>
            {lang}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
