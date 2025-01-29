"use client";

import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { CryptoTable } from "@/components/crypto-table";
import { LoadingSpinner } from "@/components/loading";
import { ErrorDisplay } from "@/components/error-display";
import { CryptoData } from "@/types/crypto";

// Utility function to fetch data with retry logic
const fetchDataWithRetry = async (attempt = 1): Promise<CryptoData[]> => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false"
    );

    if (!response.ok) {
      if (response.status === 429 && attempt <= 3) {
        // Retry logic with exponential backoff
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

  const fetchData = async () => {
    setError(null);
    try {
      // Check if data is in localStorage and it's still valid (within 5 minutes)
      const cachedData = localStorage.getItem("cryptoData");
      const cachedTime = localStorage.getItem("cryptoDataTime");

      const currentTime = new Date().getTime();
      if (
        cachedData &&
        cachedTime &&
        currentTime - parseInt(cachedTime) < 300000 // 5 minutes
      ) {
        setData(JSON.parse(cachedData));
        setLastUpdated(new Date(parseInt(cachedTime)));
        setLoading(false);
        return;
      }

      // Fetch fresh data
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
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes interval
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-gray-300 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-slate-600 rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Crypto Dashboard
                </h1>
                {lastUpdated && (
                  <p className="text-sm text-gray-400 mt-1">
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
