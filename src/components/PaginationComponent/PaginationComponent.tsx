import { Box, Pagination } from '@mui/material';

import { useAppSelector, useAppDispatch } from '../../store/store';
import { todoSelector, setPage } from '../../store/slices/todoSlice';

const PaginationComponent = () => {

  const {totalPages, currentPage} = useAppSelector(todoSelector)
  const dispatch = useAppDispatch()

  const handleChangePage = (page: number) => {
    dispatch(setPage(page))
  }

  return (
    <Box>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(_ ,value: number) => handleChangePage(value)}
        sx={{my:3}}
      />
    </Box>
  )
}

export default PaginationComponent