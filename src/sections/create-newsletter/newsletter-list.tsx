// @mui
import type { newsletterItemList } from 'src/types/newsletter';

// routes
import { useState } from 'react';

import Box from '@mui/material/Box';
import Pagination, { paginationClasses } from '@mui/material/Pagination';

import NewsletterCardItem from './newsletter-card-item';
//

// ----------------------------------------------------------------------

type Props = {
  news: newsletterItemList[];
};

export default function NewsletterList({ news }: Props) {
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
          <NewsletterCardItem key={n.id} newsletter={n} />
        ))}
      </Box>

      {news.length > 6 && (
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
