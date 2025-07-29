"use client";

import React, { useState, useMemo, useTransition } from "react";
import { schemesData, schemeCategories, type Scheme } from "@/lib/schemes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { applyForScheme } from "@/lib/actions";
import { Loader2, UploadCloud } from "lucide-react";
import { useLanguage } from "@/context/language-context";
import type { TranslationKey } from "@/lib/translations";
import { useAuth } from "@/context/auth-context";


export default function SubsidiesLoansPage() {
  const [filters, setFilters] = useState({
    search: "",
    state: "All",
    category: "All",
    type: "All",
  });
  const [isPending, startTransition] = useTransition();
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const { translate } = useLanguage();
  const { user } = useAuth();

  const handleFilterChange = (
    key: "search" | "state" | "category" | "type",
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredSchemes = useMemo(() => {
    return schemesData.filter((scheme) => {
      const schemeName = translate(scheme.nameKey as TranslationKey).toLowerCase();
      const searchMatch = schemeName.includes(filters.search.toLowerCase());
      const stateMatch =
        filters.state === "All" || scheme.state === filters.state || scheme.state === 'All';
      const categoryMatch =
        filters.category === "All" || scheme.categoryKey === filters.category;
      const typeMatch = filters.type === "All" || scheme.type === filters.type;
      return searchMatch && stateMatch && categoryMatch && typeMatch;
    });
  }, [filters, translate]);
  
  const uniqueStates = ["All", ...Array.from(new Set(schemesData.map(s => s.state).filter(s => s !== "All")))];

  const handleApplyClick = (scheme: Scheme) => {
    setSelectedScheme(scheme);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedScheme) return;

    if (!user) {
        toast({
            title: translate("toast.authError.title"),
            description: translate("toast.authError.description"),
            variant: "destructive",
        });
        return;
    }

    const formData = new FormData(event.currentTarget);
    formData.append("schemeId", selectedScheme.id);
    formData.append("schemeName", translate(selectedScheme.nameKey as TranslationKey));
    formData.append("userId", user.uid);

    startTransition(async () => {
      const result = await applyForScheme(formData);
      if (result.success) {
        toast({
          title: translate("toast.applySuccess.title"),
          description: result.message,
        });
        setIsFormOpen(false);
        setSelectedScheme(null);
      } else {
        toast({
          title: translate("toast.applyError.title"),
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {translate("subsidies.title")}
        </h1>
        <p className="text-muted-foreground">
          {translate("subsidies.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{translate("subsidies.filterTitle")}</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            <Input
              placeholder={translate("subsidies.searchPlaceholder")}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
            <Select
              value={filters.state}
              onValueChange={(value) => handleFilterChange("state", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={translate("subsidies.filterState")} />
              </SelectTrigger>
              <SelectContent>
                {uniqueStates.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={translate("subsidies.filterCategory")} />
              </SelectTrigger>
              <SelectContent>
                 <SelectItem value="All">{translate("subsidies.allCategories")}</SelectItem>
                {schemeCategories.map((cat) => (
                  <SelectItem key={cat.key} value={cat.key}>
                    {translate(cat.nameKey as TranslationKey)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
             <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={translate("subsidies.filterType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">{translate("subsidies.allTypes")}</SelectItem>
                <SelectItem value="Subsidy">{translate("subsidies.subsidy")}</SelectItem>
                <SelectItem value="Loan">{translate("subsidies.loan")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme) => (
              <Card key={scheme.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-lg">{translate(scheme.nameKey as TranslationKey)}</CardTitle>
                    <Badge variant={scheme.type === 'Loan' ? 'destructive' : 'default'}>{translate(scheme.type === 'Loan' ? "subsidies.loan" : "subsidies.subsidy")}</Badge>
                  </div>
                  <CardDescription>
                      {translate("subsidies.categoryLabel")}: {translate(schemeCategories.find(c => c.key === scheme.categoryKey)?.nameKey as TranslationKey)} | {translate("subsidies.stateLabel")}: {scheme.state}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm flex-grow">
                    <p><strong>{translate("subsidies.eligibilityLabel")}:</strong> {translate(scheme.eligibilityKey as TranslationKey)}</p>
                    <p><strong>{translate("subsidies.benefitsLabel")}:</strong> {translate(scheme.benefitsKey as TranslationKey)}</p>
                    <p><strong>{translate("subsidies.lastDateLabel")}:</strong> {scheme.lastDate}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" onClick={() => handleApplyClick(scheme)}>
                    {translate("subsidies.applyButton")}
                  </Button>
                </CardFooter>
              </Card>
            ))}
             {filteredSchemes.length === 0 && (
                <div className="md:col-span-2 lg:col-span-3 text-center text-muted-foreground py-10">
                    {translate("subsidies.noSchemes")}
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{translate("subsidies.form.title")}: {selectedScheme ? translate(selectedScheme.nameKey as TranslationKey) : ""}</DialogTitle>
            <DialogDescription>
              {translate("subsidies.form.description")}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
             <div className="grid gap-2">
                <Label htmlFor="farmerName">{translate("subsidies.form.farmerName")}</Label>
                <Input id="farmerName" name="farmerName" defaultValue={user?.displayName || ''} required />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="landSize">{translate("subsidies.form.landSize")}</Label>
                    <Input id="landSize" name="landSize" type="number" placeholder={translate("subsidies.form.landSizePlaceholder")} required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="cropType">{translate("subsidies.form.cropType")}</Label>
                    <Input id="cropType" name="cropType" placeholder={translate("subsidies.form.cropTypePlaceholder")} required />
                </div>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="aadhaarNumber">{translate("subsidies.form.aadhaar")}</Label>
                <Input id="aadhaarNumber" name="aadhaarNumber" placeholder="XXXX XXXX XXXX" required />
            </div>
             <div className="grid gap-2">
                <Label htmlFor="bankAccount">{translate("subsidies.form.bankAccount")}</Label>
                <Input id="bankAccount" name="bankAccount" placeholder={translate("subsidies.form.bankAccountPlaceholder")} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="address">{translate("subsidies.form.address")}</Label>
                <Input id="address" name="address" placeholder={translate("subsidies.form.addressPlaceholder")} required />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="document">{translate("subsidies.form.documents")}</Label>
                <div className="flex items-center justify-center w-full">
                    <Label htmlFor="document" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">{translate("subsidies.form.uploadClick")}</span>{translate("subsidies.form.uploadDrag")}</p>
                            <p className="text-xs text-muted-foreground">{translate("subsidies.form.uploadHint")}</p>
                        </div>
                        <Input id="document" name="document" type="file" className="hidden" />
                    </Label>
                </div>
            </div>
             <div className="flex justify-end gap-2 pt-4">
                <DialogClose asChild>
                    <Button type="button" variant="outline">{translate("subsidies.form.cancelButton")}</Button>
                </DialogClose>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {translate("subsidies.form.submitButton")}
                </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    