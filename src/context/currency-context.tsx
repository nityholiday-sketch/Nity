"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CurrencyCode = "INR" | "USD";

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  flag: string;
  rate: number; // Conversion rate from base INR (e.g. 1 INR = 0.0116 USD, ~86 INR/USD)
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "🇮🇳",
    rate: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    flag: "🇺🇸",
    rate: 0.0116, // Approx 1 USD = 86.2 INR
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  currencyConfig: CurrencyConfig;
  setCurrency: (code: CurrencyCode) => void;
  convertPrice: (amountInINR: number) => number;
  formatPrice: (amountInINR: number) => string;
  formatAmount: (amount: number, code?: CurrencyCode) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("INR");

  // Load user preference from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("nityholiday_currency") as CurrencyCode;
      if (saved && (saved === "INR" || saved === "USD")) {
        setCurrencyState(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      localStorage.setItem("nityholiday_currency", code);
    } catch {
      // Ignore localStorage errors
    }
  };

  const currencyConfig = CURRENCIES[currency];

  // Convert INR amount to the current currency
  const convertPrice = (amountInINR: number): number => {
    if (currency === "INR") return Math.round(amountInINR);
    const converted = amountInINR * CURRENCIES.USD.rate;
    // Round to whole USD for cleaner pricing
    return Math.max(1, Math.round(converted));
  };

  // Convert and format an INR price into the current currency string
  const formatPrice = (amountInINR: number): string => {
    const value = convertPrice(amountInINR);
    return `${currencyConfig.symbol}${value.toLocaleString()}`;
  };

  // Format an already converted or raw amount
  const formatAmount = (amount: number, code: CurrencyCode = currency): string => {
    const cfg = CURRENCIES[code] || currencyConfig;
    return `${cfg.symbol}${amount.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        currencyConfig,
        setCurrency,
        convertPrice,
        formatPrice,
        formatAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
