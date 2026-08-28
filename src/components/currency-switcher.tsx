"use client";

import React from "react";
import { useCurrency, CurrencyCode } from "@/context/currency-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  className?: string;
  variant?: "outline" | "ghost" | "default";
  size?: "sm" | "default" | "lg" | "icon";
}

export function CurrencySwitcher({
  className,
  variant = "outline",
  size = "sm",
}: CurrencySwitcherProps) {
  const { currency, setCurrency, currencyConfig } = useCurrency();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "h-9 px-3 gap-1.5 font-medium border rounded-full text-xs sm:text-sm transition-all hover:bg-secondary",
            className
          )}
        >
          <span className="text-base leading-none">{currencyConfig.flag}</span>
          <span className="font-semibold">{currencyConfig.code}</span>
          <span className="text-muted-foreground font-normal">({currencyConfig.symbol})</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60 ml-0.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-1.5 space-y-1">
        <DropdownMenuItem
          onClick={() => setCurrency("INR")}
          className={cn(
            "flex items-center justify-between cursor-pointer rounded-md py-2 px-2.5 text-sm font-medium",
            currency === "INR" ? "bg-primary/10 text-primary font-semibold" : ""
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🇮🇳</span>
            <span>INR (₹)</span>
          </div>
          {currency === "INR" && <span className="text-xs text-primary font-bold">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setCurrency("USD")}
          className={cn(
            "flex items-center justify-between cursor-pointer rounded-md py-2 px-2.5 text-sm font-medium",
            currency === "USD" ? "bg-primary/10 text-primary font-semibold" : ""
          )}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span>
            <span>USD ($)</span>
          </div>
          {currency === "USD" && <span className="text-xs text-primary font-bold">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CurrencySegmentedToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className={cn("inline-flex rounded-lg bg-secondary/80 p-1 border text-xs font-semibold", className)}>
      <button
        type="button"
        onClick={() => setCurrency("INR")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all",
          currency === "INR"
            ? "bg-background text-foreground shadow-sm font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span>🇮🇳</span>
        <span>INR (₹)</span>
      </button>
      <button
        type="button"
        onClick={() => setCurrency("USD")}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all",
          currency === "USD"
            ? "bg-background text-foreground shadow-sm font-bold"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <span>🇺🇸</span>
        <span>USD ($)</span>
      </button>
    </div>
  );
}
