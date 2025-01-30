"use client";

import { useEffect, useState, useCallback } from "react";
import { RefreshCcw } from "lucide-react";
import { CryptoTable } from "@/components/crypto-table";
import { LoadingSpinner } from "@/components/loading";
import { ErrorDisplay } from "@/components/error-display";
import { CryptoData } from "@/types/crypto";

// Utility function to fetch data with retry logic
const fetchDataWithRetry = async (attempt = 1): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=500&sparkline=false"
    );

    if (!response.ok) {
      if (response.status === 429 && attempt <= 3) {
        const delay = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, delay));
        return fetchDataWithRetry(attempt + 1);
      }
      throw new Error("Failed to fetch data");
    }

    const data = await response.json();
    return data;
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : "An error occurred");
  }
};

export default function Home() {
  const [data, setData] = useState<CryptoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Memoized fetchData function
  const fetchData = useCallback(async () => {
    setError(null);
    try {
      const cachedData = localStorage.getItem("cryptoData");
      const cachedTime = localStorage.getItem("cryptoDataTime");
      const currentTime = new Date().getTime();

      if (
        cachedData &&
        cachedTime &&
        currentTime - parseInt(cachedTime) < 30000 //30s
      ) {
        setData(JSON.parse(cachedData));
        setLastUpdated(new Date(parseInt(cachedTime)));
        setLoading(false);
        return;
      }

      const freshData = await fetchDataWithRetry();
      setData(freshData);
      setLastUpdated(new Date());

      // Cache data in localStorage
      localStorage.setItem("cryptoData", JSON.stringify(freshData));
      localStorage.setItem("cryptoDataTime", currentTime.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  // useEffect for fetching data on mount and setting up the interval
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <main className="min-h-screen bg-gray-300 text-orange-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="bg-slate-700 rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b border-slate-800">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-orange-200">
                  Crypto Dashboard
                </h1>
                {lastUpdated && (
                  <p className="text-sm text-gray-300 mt-1">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                )}
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCcw
                  size={20}
                  className={`text-zinc-500 ${loading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* Content */}
          <div>
            {loading && data.length === 0 ? (
              <LoadingSpinner />
            ) : error ? (
              <ErrorDisplay message={error} onRetry={fetchData} />
            ) : (
              <CryptoTable data={data} />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
