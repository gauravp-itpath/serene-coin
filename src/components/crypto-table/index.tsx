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
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import PaginationControls from "../pagination";

export function CryptoTable({ data }: CryptoTableProps) {
  console.log(data[0], "data");
  const [sortBy, setSortBy] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [marketCapFilter, setMarketCapFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

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
        // Market cap greater than or equal to $100 billion
        return coin.market_cap >= 100000000000;
      case "medium":
        // Market cap between $10 billion to $100bilion
        return coin.market_cap >= 10000000000 && coin.market_cap < 100000000000;
      case "low":
        // Market cap less than $10 billion
        return coin.market_cap < 10000000000;
      default:
        // No filter applied
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
      <div className="bg-slate-700 rounded-lg p-3 space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-400 rounded-lg px-4 py-2 pl-10 text-gray-800 font-semibold 
                       placeholder-gray-700 focus:ring-2 focus:ring-zinc-600 outline-none"
            />
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"
              size={18}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors
                     ${
                       showFilters
                         ? "bg-zinc-500 text-[#787765]"
                         : "bg-gray-400 text-gray-700 "
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
                <option value="high">High ($100 B+)</option>
                <option value="medium">Medium ($10B-$100B)</option>
                <option value="low">Low ($10B)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-700/50 h-[40px]">
                <th className="p-4 text-left text-orange-200  font-medium w-20">
                  Rank
                </th>
                <th className="p-4 text-left text-orange-200  font-medium w-[200px] text-pretty">
                  Asset
                </th>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    className="p-4 text-right text-orange-200  font-medium cursor-pointer 
                    transition-colors w-[150px] relative"
                    onClick={() => column.sortable && handleSort(column.field)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <p className="hover:text-orange-400 ">{column.label}</p>
                      {column.sortable && (
                        <span className="  text-gray-200">
                          {sortBy === column.field ? (
                            sortDirection === "asc" ? (
                              <ArrowUp size={16} className="text-gray-300" />
                            ) : (
                              <ArrowDown size={16} className="text-gray-300" />
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
                  className="hover:bg-gray-500/70 transition-colors duration-200 h-[50px]"
                >
                  <td className="p-4 text-orange-200 font-medium">
                    {startIndex + index + 1}
                  </td>
                  <td className="p-4 w-[200px]">
                    <div className="flex items-center gap-3">
                      <img
                        src={coin.image}
                        alt={coin.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="font-medium text-yellow-100">
                          {coin.name}
                        </div>
                        <div className="text-sm text-lime-300">
                          {coin.symbol.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium text-yellow-100">
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
                  <td className="p-4 text-right text-yellow-100">
                    {formatCurrency(coin.high_24h)}
                  </td>
                  <td className="p-4 text-right text-yellow-100">
                    {formatCurrency(coin.low_24h)}
                  </td>
                  <td className="p-4 text-right text-yellow-100">
                    {formatLargeNumber(coin.market_cap)}
                  </td>
                  <td className="p-4 text-right text-yellow-100">
                    {formatVolumeNumber(coin.total_volume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageChange={handlePageChange}
          filteredAndSortedDataLength={filteredAndSortedData.length}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>
    </div>
  );
}
