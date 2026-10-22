
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ page, totalPages, totalItems, pageSize, onChange }) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination">
      <span>
        Showing <strong>{start}–{end}</strong> of <strong>{totalItems}</strong>
      </span>
      <div className="pagination-controls">
        <button type="button" disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map(number => (
          <button
            key={number}
            type="button"
            className={page === number ? "current-page" : ""}
            onClick={() => onChange(number)}
            aria-current={page === number ? "page" : undefined}
          >
            {number}
          </button>
        ))}
        <button type="button" disabled={page >= totalPages} onClick={() => onChange(page + 1)} aria-label="Next page">
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}
