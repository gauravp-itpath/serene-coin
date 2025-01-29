import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
  filteredAndSortedDataLength: number;
  startIndex: number;
  endIndex: number;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  handlePageChange,
  filteredAndSortedDataLength,
  startIndex,
  endIndex,
}) => (
  <div className="flex items-center justify-between px-4 py-3 border-t border-gray-700">
    <div className="text-sm text-gray-400">
      Showing {startIndex + 1} to{" "}
      {Math.min(endIndex, filteredAndSortedDataLength)} of{" "}
      {filteredAndSortedDataLength} results
    </div>
    <div className="flex gap-4">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-orange-200"
      >
        <ChevronLeft size={16} />
      </button>
      <div className="flex items-center gap-2 text-gray-400">
        <span>{currentPage}</span>/<span>{totalPages}</span>
      </div>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-orange-200"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  </div>
);

export default PaginationControls;
