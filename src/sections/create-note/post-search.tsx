/* eslint-disable no-nested-ternary */
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';

// @mui
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
// routes
// import { useRouter } from 'src/routes/hooks';
import type { RootState } from 'src/store';
import type { NotaItemList} from 'src/store/slices/noteStore';

// types
import { useDispatch, useSelector } from 'react-redux';

import { setShowEditor, setcurrentNota } from 'src/store/slices/noteStore';

// components
import { Iconify } from 'src/components/iconify';
import { SearchNotFound } from 'src/components/search-not-found';

// ----------------------------------------------------------------------

type Props = {
  query: string;
  results: NotaItemList[];
  onSearch: (inputValue: string) => void;
  hrefItem: (id: string) => string;
};

export default function PostSearch({ query, results, onSearch, hrefItem }: Props) {
  // const router = useRouter();

  const distpach = useDispatch();

  const noteList = useSelector((state: RootState) => state.note.noteList);

  const handleClick = (id: string) => {
    const selectNote = noteList.filter((post) => post.id === id)[0];

    const dataNewsletter =
      typeof selectNote.objData === 'string'
        ? selectNote.objData !== '' && selectNote.objData.startsWith('[')
          ? JSON.parse(selectNote.objData)
          : null
        : selectNote.objData;

    if (!dataNewsletter) return;
    distpach(setcurrentNota(dataNewsletter));
    distpach(setShowEditor(true));
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (query) {
      if (event.key === 'Enter') {
        const selectProduct = results.filter((post) => post.content === query)[0];

        handleClick(selectProduct.id);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => onSearch(newValue)}
      getOptionLabel={(option) => option.content}
      noOptionsText={<SearchNotFound query={query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search post"
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, post, { inputValue }) => {
        const matches = match(post?.title, inputValue);
        const parts = parse(post?.title, matches);

        return (
          <Box component="li" {...props} onClick={() => handleClick(post.id)} key={post.id}>
            {/* <Avatar
              key={post.id}
              alt={post.content}
              src={post.mediaUrls[0]}
              variant="rounded"
              sx={{
                width: 48,
                height: 48,
                flexShrink: 0,
                mr: 1.5,
                borderRadius: 1,
              }}
            /> */}

            <div key={inputValue}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  );
}
