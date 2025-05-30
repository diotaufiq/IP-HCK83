import { Pagination as BootstrapPagination } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentPage } from '../redux/features/carSlice';

const Pagination = () => {
  const { filteredCars, currentPage, carsPerPage } = useSelector((state) => state.cars);
  const dispatch = useDispatch();

  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  const handlePageChange = (pageNumber) => {
    dispatch(setCurrentPage(pageNumber));
    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Don't render pagination if there's only one page
  if (totalPages <= 1) return null;

  return (
    <BootstrapPagination className="justify-content-center mt-4">
      <BootstrapPagination.First 
        onClick={() => handlePageChange(1)} 
        disabled={currentPage === 1} 
      />
      <BootstrapPagination.Prev 
        onClick={() => handlePageChange(currentPage - 1)} 
        disabled={currentPage === 1} 
      />
      
      {[...Array(totalPages).keys()].map((number) => {
        const pageNumber = number + 1;
        // Show only 5 page numbers centered around current page
        if (
          pageNumber === 1 ||
          pageNumber === totalPages ||
          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
        ) {
          return (
            <BootstrapPagination.Item
              key={pageNumber}
              active={pageNumber === currentPage}
              onClick={() => handlePageChange(pageNumber)}
            >
              {pageNumber}
            </BootstrapPagination.Item>
          );
        } else if (
          (pageNumber === currentPage - 2 && currentPage > 3) ||
          (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
        ) {
          return <BootstrapPagination.Ellipsis key={pageNumber} />;
        }
        return null;
      })}
      
      <BootstrapPagination.Next 
        onClick={() => handlePageChange(currentPage + 1)} 
        disabled={currentPage === totalPages} 
      />
      <BootstrapPagination.Last 
        onClick={() => handlePageChange(totalPages)} 
        disabled={currentPage === totalPages} 
      />
    </BootstrapPagination>
  );
};

export default Pagination;