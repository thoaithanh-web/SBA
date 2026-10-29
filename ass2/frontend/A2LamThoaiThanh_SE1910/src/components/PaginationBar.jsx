// Author: Lam Thoai Thanh - CE190169
export default function PaginationBar({ data, page, onPage, disabled }) {
  return (
    <div className="pagination-bar">
      <span>
        {data.totalElements} records · Page {data.totalPages ? page + 1 : 0} of{" "}
        {data.totalPages}
      </span>
      <div className="pagination-controls">
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={disabled || page === 0}
          onClick={() => onPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          disabled={disabled || page + 1 >= data.totalPages}
          onClick={() => onPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
