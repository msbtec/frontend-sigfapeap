import React, { useMemo, useCallback } from "react";
import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import PropTypes from "prop-types";

const PaginationView = ({ currentPage, totalPages, handleChangePage }) => {
  const prev = useMemo(() => {
    const calc = currentPage - 1;

    if (calc <= 0) return 1;
    return calc;
  }, [currentPage]);

  const next = useMemo(() => {
    const calc = currentPage + 1;

    if (calc > totalPages) return totalPages;

    return calc;
  }, [currentPage, totalPages]);

  const calculateInterval = useMemo(() => totalPages - currentPage, [
    currentPage,
    totalPages,
  ]);

  const buttonPrevDisable = useMemo(() => prev === currentPage, [
    currentPage,
    prev,
  ]);

  const buttonNextDisable = useMemo(() => next === currentPage, [
    currentPage,
    next,
  ]);

  const onChangePage = useCallback(
    (page) => {
      if (page === 0) return;
      if (page > totalPages) return;

      handleChangePage(page);
    },
    [handleChangePage, totalPages],
  );

  return (
    <Pagination aria-label="Page navigation example">
      <PaginationItem
        disabled={buttonPrevDisable}
        onClick={() => onChangePage(currentPage - 1)}
      >
        <PaginationLink previous />
      </PaginationItem>

      {currentPage > 2 && (
        <>
          <PaginationItem>
            <PaginationLink onClick={() => onChangePage(1)}>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
        </>
      )}

      {!buttonPrevDisable && (
        <PaginationItem>
          <PaginationLink onClick={() => onChangePage(prev)}>
            {prev}
          </PaginationLink>
        </PaginationItem>
      )}
      <PaginationItem active onClick={() => {}}>
        <PaginationLink>{currentPage}</PaginationLink>
      </PaginationItem>

      {!buttonNextDisable && (
        <PaginationItem>
          <PaginationLink onClick={() => onChangePage(next)}>
            {next}
          </PaginationLink>
        </PaginationItem>
      )}
      {calculateInterval > 2 && (
        <>
          <PaginationItem>
            <PaginationLink>...</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink onClick={() => onChangePage(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      )}
      <PaginationItem
        disabled={buttonNextDisable}
        onClick={() => onChangePage(currentPage + 1)}
      >
        <PaginationLink next />
      </PaginationItem>
    </Pagination>
  );
};

export default PaginationView;

PaginationView.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handleChangePage: PropTypes.func.isRequired,
};
