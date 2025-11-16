import { Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@reduxjs/toolkit/query';
import { setFilters } from '../redux-toolkit/mainSlice';
import { paginationInterface } from '../interface/interface';

interface PaginationBlockProps {
  paginationData: paginationInterface;
}

export default function PaginationBlock({ paginationData }: PaginationBlockProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const filtersParams = useSelector((state: RootState) => state.main.filtersParams);

  const handlePageChange = (page: number, pageSize?: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set('page', page.toString());
    params.set('limit', (pageSize || filtersParams.limit).toString());
    navigate(`/list?${params.toString()}`);

    dispatch(
      setFilters({
        page,
        limit: pageSize || filtersParams.limit,
      })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Pagination
      total={paginationData.totalItems}
      current={filtersParams.page}
      pageSize={filtersParams.limit}
      simple
      showSizeChanger
      pageSizeOptions={['5', '10', '20', `${paginationData.totalItems}`]}
      showTotal={() => `Всего ${paginationData.totalItems} объявлений`}
      onChange={handlePageChange}
      onShowSizeChange={handlePageChange}
    />
  );
}
