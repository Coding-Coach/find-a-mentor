import styled from 'styled-components/macro';
import { useFilters } from '../../context/filtersContext/FiltersContext';
import { useFilterParams } from '../../utils/permaLinkService';

type PagerProps = {
  page: number;
  hasNext: boolean;
  onPage: (page: number) => void;
};

const StyledPager = styled.div`
  display: flex;
`;

export const Pager = ({ hasNext }: PagerProps) => {
  const [state, dispatch] = useFilters();
  const { setFilterParams } = useFilterParams();
  const { page } = state;

  const setPage = (page: number) => {
    setFilterParams('page', page > 1 && page);
    dispatch({
      type: 'setPage',
      payload: page,
    });
  };

  return (
    <StyledPager>
      {page > 1 && <button onClick={() => setPage(page - 1)}>Prev</button>}
      {hasNext && <button onClick={() => setPage(page + 1)}>Next</button>}
    </StyledPager>
  );
};
