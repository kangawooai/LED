"use client";

import { useState, useEffect, useCallback } from "react";
import { getAccountSettings } from "@/lib/api/account";
import {
  formatCurrency as formatCurrencyUtil,
  convertCurrency,
} from "@/lib/utils/currency";
import type { CurrencyCode } from "@/lib/types/crm";

let cachedRates: Record<string, number> | null = null;

export function useCurrency() {
  const [displayCurrency, setDisplayCurrency] = useState<CurrencyCode>("GBP");
  const [exchangeRates, setExchangeRates] = useState<Record<
    string,
    number
  > | null>(cachedRates);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    getAccountSettings()
      .then((settings) => {
        const currency = (settings.currency || "GBP") as CurrencyCode;
        setDisplayCurrency(currency);

        if (currency !== "GBP") {
          if (cachedRates) {
            setExchangeRates(cachedRates);
          } else {
            return fetch("/api/exchange-rates")
              .then((res) => res.json())
              .then((rates) => {
                cachedRates = rates;
                setExchangeRates(rates);
              });
          }
        } else {
          setExchangeRates(null);
        }
      })
      .catch((err) =>
        console.error("Failed to fetch currency settings:", err)
      )
      .finally(() => setIsLoaded(true));
  }, []);

  const formatAmount = useCallback(
    (amount: number) => {
      if (displayCurrency === "GBP" || !exchangeRates) {
        return formatCurrencyUtil(amount, displayCurrency);
      }
      const converted = convertCurrency(
        amount,
        exchangeRates[displayCurrency] || 1
      );
      return formatCurrencyUtil(converted, displayCurrency);
    },
    [displayCurrency, exchangeRates]
  );

  const toDisplayCurrency = useCallback(
    (amountGBP: number) => {
      if (displayCurrency === "GBP" || !exchangeRates) return amountGBP;
      return convertCurrency(amountGBP, exchangeRates[displayCurrency] || 1);
    },
    [displayCurrency, exchangeRates]
  );

  const toGBP = useCallback(
    (amountInDisplayCurrency: number) => {
      if (displayCurrency === "GBP" || !exchangeRates)
        return amountInDisplayCurrency;
      const rate = exchangeRates[displayCurrency] || 1;
      return convertCurrency(amountInDisplayCurrency, 1 / rate);
    },
    [displayCurrency, exchangeRates]
  );

  return { displayCurrency, formatAmount, toDisplayCurrency, toGBP, isLoaded };
}
