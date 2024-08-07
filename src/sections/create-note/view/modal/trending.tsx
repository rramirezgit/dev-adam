import React, { useState } from 'react';

import {
  Tab,
  Box,
  Tabs,
  Link,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface Article {
  title: string;
  link: string;
}

interface Topic {
  query: string;
  articles: Article[];
}

interface CountryData {
  title: string;
  topics: Topic[];
}

export interface Data {
  mexico: CountryData;
  usa: CountryData;
  reddit: {
    title: string;
    topics: { title: string; url: string }[];
  };
}

interface TrenddingDialogProps {
  data: Data;
  open: boolean;
  setOpen: any;
}

const TrenddingDialog = ({ data, open, setOpen }: TrenddingDialogProps) => {
  const [currentTab, setCurrentTab] = useState('mexico');

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={handleClose}>
      <DialogTitle>{data[currentTab as keyof Data].title}</DialogTitle>
      <DialogContent>
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            mb: 2,
            alignSelf: 'start',
            '& .MuiTabs-indicator': {
              top: 35,
              backgroundColor: '#7778EC',
            },
            '& .MuiTab-root': {
              color: 'text.secondary',
            },
            '& .Mui-selected': {
              color: '#7778EC',
            },
          }}
        >
          {['mexico', 'usa', 'reddit'].map((tab) => (
            <Tab key={tab} value={tab} label={tab.toUpperCase()} />
          ))}
        </Tabs>
        <Box>
          {currentTab !== 'reddit'
            ? (data[currentTab as keyof Data] as CountryData).topics.map((topic) => (
                <Box key={topic.query} sx={{ mb: 2 }}>
                  <Typography variant="h6">{topic.query}</Typography>
                  {topic.articles.map((article, index) => (
                    <Typography key={index}>
                      <Link href={article.link} target="_blank" rel="noopener">
                        {article.title}
                      </Link>
                    </Typography>
                  ))}
                </Box>
              ))
            : data.reddit.topics.map((topic, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    <Link href={topic.url} target="_blank" rel="noopener">
                      {topic.title}
                    </Link>
                  </Typography>
                </Box>
              ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TrenddingDialog;
