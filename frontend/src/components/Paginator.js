import PropTypes from "prop-types";
const Paginator = ({ numberOfPages, current, paginate }) => {
  const RANGE = (x, y) =>
    Array.from(
      (function* () {
        while (x <= y) yield x++;
      })()
    );
  return (
    <nav
      className="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <button
        className={
          current <= 1
            ? "pagination-previous is-disabled"
            : "pagination-previous"
        }
        onClick={() => current > 1 && paginate(current - 1)}
      >
        Previous
      </button>
      <button
        className={
          current >= numberOfPages
            ? "pagination-next is-disabled"
            : "pagination-next"
        }
        onClick={() => current < numberOfPages && paginate(current + 1)}
      >
        Next page
      </button>
      <ul className="pagination-list">
        {RANGE(1, numberOfPages).map((number) =>
          number === current ? (
            <li key={"pagination" + number}>
              <button
                className="pagination-link is-current"
                aria-label="Page {number}"
                aria-current="page"
              >
                {number}
              </button>
            </li>
          ) : (
            <li key={"pagination" + number}>
              <button
                className="pagination-link"
                aria-label="Goto page {number}"
                onClick={() => paginate(number)}
              >
                {number}
              </button>
            </li>
          )
        )}
      </ul>
    </nav>
  );
};

Paginator.propTypes = {
  numberOfPages: PropTypes.number.isRequired,
  current: PropTypes.number,
};

export default Paginator;
