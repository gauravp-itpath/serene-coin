import {
  formatCurrency,
  formatLargeNumber,
  formatVolumeNumber,
} from "@/lib/formatters";
import {
  Column,
  CryptoData,
  CryptoTableProps,
  SortField,
} from "@/types/crypto";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";

export function CryptoTable({ data }: CryptoTableProps) {
  const [sortBy, setSortBy] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [marketCapFilter, setMarketCapFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  // Add pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const columns: Column[] = [
    { label: "Price", field: "price", sortable: true },
    { label: "24h Change", field: "price_change", sortable: true },
    { label: "24h High", field: "high_24h", sortable: true },
    { label: "24h Low", field: "low_24h", sortable: true },
    { label: "Market Cap", field: "market_cap", sortable: true },
    { label: "Volume (24h)", field: "volume", sortable: true },
  ];

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  // Filter functions
  const filterBySearch = (coin: CryptoData) =>
    searchTerm === "" ||
    coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());

  const filterByPrice = (coin: CryptoData) =>
    (!priceRange.min || coin.current_price >= Number(priceRange.min)) &&
    (!priceRange.max || coin.current_price <= Number(priceRange.max));

  const filterByMarketCap = (coin: CryptoData) => {
    switch (marketCapFilter) {
      case "high":
        return coin.market_cap >= 10000000000; // $10B+
      case "medium":
        return coin.market_cap >= 1000000000 && coin.market_cap < 10000000000; // $1B-$10B
      case "low":
        return coin.market_cap < 1000000000; // <$1B
      default:
        return true;
    }
  };

  // Apply all filters and sorting
  const filteredAndSortedData = [...data]
    .filter(filterBySearch)
    .filter(filterByPrice)
    .filter(filterByMarketCap)
    .sort((a, b) => {
      if (!sortBy) return 0;

      const getValueByField = (coin: CryptoData, field: SortField) => {
        switch (field) {
          case "price":
            return coin.current_price;
          case "price_change":
            return coin.price_change_percentage_24h;
          case "market_cap":
            return coin.market_cap;
          case "volume":
            return coin.total_volume;
          case "high_24h":
            return coin.high_24h;
          case "low_24h":
            return coin.low_24h;
          default:
            return 0;
        }
      };

      const aValue = getValueByField(a, sortBy);
      const bValue = getValueByField(b, sortBy);
      return (aValue - bValue) * (sortDirection === "asc" ? 1 : -1);
    });

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Pagination controls
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-4 ">
      {/* Search and Filter Controls */}
      <div className="bg-slate-600 rounded-lg p-4 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700 rounded-lg px-4 py-2 pl-10 text-gray-200 
                       placeholder-gray-400 focus:ring-2 focus:ring-zinc-500 outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                     ${
                       showFilters
                         ? "bg-zinc-500 text-white"
                         : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                     }`}
          >
            <SlidersHorizontal size={18} />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-700">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Price Range (USD)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                  className="w-full bg-gray-700 rounded-lg px-3 py-1 text-gray-200"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
                  className="w-full bg-gray-700 rounded-lg px-3 py-1 text-gray-200"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Market Cap</label>
              <select
                value={marketCapFilter}
                onChange={(e) => setMarketCapFilter(e.target.value as any)}
                className="w-full bg-gray-700 rounded-lg px-3 py-2 text-gray-200"
              >
                <option value="all">All</option>
                <option value="high">High ($10B+)</option>
                <option value="medium">Medium ($1B-$10B)</option>
                <option value="low">Low ($1B)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-600 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-600/50">
                <th className="p-4 text-left text-gray-400 font-medium">
                  Rank
                </th>
                <th className="p-4 text-left text-gray-400 font-medium">
                  Asset
                </th>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className="p-4 text-right text-gray-400 font-medium cursor-pointer 
                             hover:text-white transition-colors"
                    onClick={() => column.sortable && handleSort(column.field)}
                  >
                    <div className="flex items-center justify-end gap-2">
                      {column.label}
                      {column.sortable && (
                        <span className="text-gray-500">
                          {sortBy === column.field ? (
                            sortDirection === "asc" ? (
                              <ArrowUp size={16} className="text-zinc-500" />
                            ) : (
                              <ArrowDown size={16} className="text-zinc-500" />
                            )
                          ) : (
                            <ArrowUpDown size={16} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {currentData.map((coin, index) => (
                <tr
                  key={coin.id}
                  className="hover:bg-gray-700/30 transition-colors duration-200"
                >
                  <td className="p-4 text-gray-300">
                    {startIndex + index + 1}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-gray-200">
                          {coin.name}
                        </div>
                        <div className="text-sm text-gray-400">
                          {coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-gray-200">
                    {formatCurrency(coin.current_price)}
                  </td>
                  <td className="p-4 text-right">
                    <div
                      className={`inline-flex items-center gap-1 ${
                        coin.price_change_percentage_24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {coin.price_change_percentage_24h >= 0 ? (
                        <ArrowUp size={16} />
                      ) : (
                        <ArrowDown size={16} />
                      )}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-200">
                    {formatCurrency(coin.high_24h)}
                  </td>
                  <td className="p-4 text-right text-gray-200">
                    {formatCurrency(coin.low_24h)}
                  </td>
                  <td className="p-4 text-right text-gray-200">
                    {formatLargeNumber(coin.market_cap)}
                  </td>
                  <td className="p-4 text-right text-gray-200">
                    {formatVolumeNumber(coin.total_volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredAndSortedData.length)} of{" "}
            {filteredAndSortedData.length} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={20} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
