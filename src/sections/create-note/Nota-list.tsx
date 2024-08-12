// @mui
import type { NotaItemList } from 'src/store/slices/noteStore';

// routes
import { useState } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import NotaCardItem from 'src/components/Nota-card-item';
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
        display="flex"
        sx={{
          flexWrap: 'wrap',
          width: '100%',
          justifyContent: 'center',
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
