
import { Search, SlidersHorizontal } from "lucide-react";

export default function SearchFilter({
  search, onSearch, filters = [], extra
}) {
  return (
    <div className="table-toolbar">
      <label className="search-box">
        <Search size={16} />
        <input
          type="search"
          value={search}
          onChange={event => onSearch(event.target.value)}
          placeholder="Search records..."
          aria-label="Search records"
        />
      </label>

      <div className="toolbar-right">
        {filters.map(filter => (
          <label className="filter-select" key={filter.label}>
            <SlidersHorizontal size={13} />
            <select
              aria-label={filter.label}
              value={filter.value}
              onChange={event => filter.onChange(event.target.value)}
            >
              {filter.options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        ))}
        {extra}
      </div>
    </div>
  );
}
