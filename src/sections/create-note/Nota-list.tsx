// @mui
import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';
// routes
import { useState } from 'react';
import { NotaItemList } from 'src/store/slices/noteStore';
import NotaCardItem from './Nota-card-item';
//

// ----------------------------------------------------------------------

type Props = {
  news: NotaItemList[];
};

export default function NotaList({ news }: Props) {
  const [page, setPage] = useState(1);

  const renderNews = news.length > 6 ? news.slice((page - 1) * 20, page * 20) : news;

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
          lg: 'repeat(5, 1fr)',
        }}
        sx={{
          justifyItems: {
            xs: 'center',
            sm: 'stretch',
            md: 'stretch',
            lg: 'stretch',
          },
        }}
      >
        {renderNews.map((n) => (
          <NotaCardItem key={n.id} Nota={n} ChangeStatus />
        ))}
      </Box>

      {news.length > 12 && (
        <Pagination
          count={Math.ceil(news.length / 20)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          sx={{
            mt: 8,
            [`& .${paginationClasses.ul}`]: {
              justifyContent: 'center',
            },
          }}
        />
      )}
    </>
  );
}
