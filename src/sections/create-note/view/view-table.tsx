/* eslint-disable no-nested-ternary */
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
  TablePagination,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux'; // Asegúrate de importar useDispatch de react-redux
import {
  setCoverImage,
  setcurrentNota,
  setcurrentNotaDescription,
  setcurrentNotaID,
  setMenu,
  setShowEditor,
  setSubject,
} from 'src/store/slices/noteStore';
import StateBtn from './StateBtn';
import SendDialog from '../send-dialog';
import { useAxios } from 'src/auth/axios/axios-provider';
import useNotes from 'src/utils/useNotes';

type Article = {
  id: string;
  title: string;
  createdAt: string;
  origin: string;
  status: string;
  coverImageUrl?: string;
  publishOnAdac: boolean;
  objData: string | object;
  newsletterId?: string;
  description?: string;
};

type Props = {
  articles: any[];
};

const ArticlesTable: React.FC<Props> = ({ articles }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [startDate, setStartDate] = useState<any>(null);
  const [endDate, setEndDate] = useState<any>(null);
  const [titleFilter, setTitleFilter] = useState<string>('');
  const [originFilter, setOriginFilter] = useState<string>('todos');
  const [newsletterIdFilter, setNewsletterIdFilter] = useState<string>('todos');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [openAprob, setOpenAprob] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch(); // Inicializa el dispatch

  const axiosInstance = useAxios();

  const { loadNotes } = useNotes();

  const tab = useSelector((state: RootState) => state.note.selectedTab);

  useEffect(() => {
    setPage(0);
  }, [articles]);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = articles.map((article) => article.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleCheckboxClick = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleDelete = async () => {
    setOpenDelete(true);
  };

  const handleConfirmDelete = async () => {
    await Promise.all(selected.map((id) => axiosInstance.delete(`/posts/${id}`)));
    loadNotes({ tab });
    setSelected([]);
    setOpenDelete(false);
  };

  const handleChangeStatus = async (status: string) => {
    let tabNumber = 0;
    if (status === 'REVIEW') {
      tabNumber = 1;
    } else if (status === 'APPROVED') {
      tabNumber = 2;
    } else if (status === 'PUBLISHED') {
      tabNumber = 3;
      setOpenAprob(true);
      return;
    } else if (status === 'ADAC') {
      tabNumber = 4;
    }

    await Promise.all(selected.map((id) => axiosInstance.patch(`posts/${id}/status/${status}`)));
    setSelected([]);

    loadNotes({ tab: tabNumber });
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
    setTitleFilter('');
    setOriginFilter('todos');
    setNewsletterIdFilter('todos');
    setDateError(false);
  };

  const handleRowClick = (article: Article) => {
    const newCurrentNota =
      typeof article.objData === 'string'
        ? article.objData !== '' && article.objData.startsWith('[')
          ? JSON.parse(article.objData)
          : null
        : article.objData;

    if (newCurrentNota === null) return;
    dispatch(setcurrentNotaDescription(article.description || ''));
    dispatch(setcurrentNota(newCurrentNota));
    dispatch(setcurrentNotaID(article.id));
    dispatch(setCoverImage(article.coverImageUrl || ''));
    dispatch(setSubject(article.title));
    dispatch(setShowEditor(true));
    dispatch(setMenu({ type: 'none' }));
  };

  const handleNewsletterButtonClick = (id: string) => {
    console.log(`Handle newsletter button click for article with id: ${id}`);
    // Aquí puedes agregar la lógica que deseas ejecutar cuando se hace clic en el botón del newsletterId
  };

  const filteredArticles = articles.filter((article) => {
    const createdAt = new Date(article.createdAt);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;
    const matchesTitle = article.title.toLowerCase().includes(titleFilter.toLowerCase());
    const matchesOrigin = originFilter === 'todos' || article.origin === originFilter;
    const matchesNewsletterId =
      newsletterIdFilter === 'todos' ||
      (newsletterIdFilter === 'with' && article.newsletterId) ||
      (newsletterIdFilter === 'without' && !article.newsletterId);
    return (
      (!start || createdAt >= start) &&
      (!end || createdAt <= end) &&
      matchesTitle &&
      matchesOrigin &&
      matchesNewsletterId
    );
  });

  const paginatedArticles = filteredArticles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Button
          variant="contained"
          startIcon={<FilterListIcon />}
          onClick={() => setFiltersVisible(!filtersVisible)}
        >
          {filtersVisible ? 'Hide Filters' : 'Show Filters'}
        </Button>
        <Button
          variant="contained"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
          disabled={
            !startDate &&
            !endDate &&
            !titleFilter &&
            originFilter === 'todos' &&
            newsletterIdFilter === 'todos'
          }
        >
          Clear Filters
        </Button>
      </Box>
      {filtersVisible && (
        <Box
          display="flex"
          mb={2}
          sx={{
            gap: 2,
          }}
        >
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => {
              setStartDate(date);
              setDateError(!filteredArticles.length);
            }}
            slotProps={{
              textField: {
                error: dateError,
                helperText: dateError && 'No articles found in this date range',
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => {
              setEndDate(date);
              setDateError(!filteredArticles.length);
            }}
            slotProps={{
              textField: {
                error: dateError,
                helperText: dateError && 'No articles found in this date range',
              },
            }}
          />
          <TextField
            label="Title"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
          />
          <FormControl>
            <InputLabel>Origin</InputLabel>
            <Select
              variant="outlined"
              value={originFilter}
              onChange={(e) => setOriginFilter(e.target.value as string)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="ADAC">ADAC</MenuItem>
              <MenuItem value="AI">AI</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel>Usados</InputLabel>
            <Select
              value={newsletterIdFilter}
              onChange={(e) => setNewsletterIdFilter(e.target.value as string)}
            >
              <MenuItem value="todos">Todos</MenuItem>
              <MenuItem value="with">En Uso</MenuItem>
              <MenuItem value="without">Sin Uso</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
      {selected.length > 0 && (
        <Toolbar
          sx={{
            gap: 2,
          }}
        >
          <Typography variant="h6" component="div">
            {selected.length} selected
          </Typography>
          <StateBtn
            Nota={{
              status: tab
                ? tab === 0
                  ? 'DRAFT'
                  : tab === 1
                    ? 'REVIEW'
                    : tab === 2
                      ? 'APPROVED'
                      : tab === 3
                        ? 'PUBLISHED'
                        : 'ADAC'
                : 'DRAFT',
            }}
            onChange={handleChangeStatus}
          />

          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        </Toolbar>
      )}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < articles.length}
                  checked={articles.length > 0 && selected.length === articles.length}
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Origin</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Cover Image</TableCell>
              <TableCell>Publish on ADAC</TableCell>
              <TableCell>Newsletter ID</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedArticles.map((article) => {
              const isItemSelected = selected.indexOf(article.id) !== -1;
              return (
                <TableRow
                  key={article.id}
                  hover
                  onClick={() => handleRowClick(article)}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  selected={isItemSelected}
                >
                  <TableCell
                    padding="checkbox"
                    onClick={(event) => handleCheckboxClick(event, article.id)}
                  >
                    <Checkbox checked={isItemSelected} />
                  </TableCell>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>{format(new Date(article.createdAt), 'dd MMM yyyy')}</TableCell>
                  <TableCell>{article.origin}</TableCell>
                  <TableCell>{article.status}</TableCell>
                  <TableCell>
                    {article.coverImageUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={article.coverImageUrl}
                        alt={article.title}
                        style={{ width: 90, height: 50, borderRadius: '8px' }}
                      />
                    )}
                  </TableCell>
                  <TableCell>{article.publishOnAdac ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {article.newsletterId && (
                      <Button
                        variant="contained"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNewsletterButtonClick(article.id);
                        }}
                      >
                        {article.id}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 15, 25]}
        component="div"
        count={filteredArticles.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <SendDialog
        open={openAprob}
        setOpen={setOpenAprob}
        handleclickSaved={async () => {
          await Promise.all(
            selected.map((id) => axiosInstance.patch(`posts/${id}/status/PUBLISHED`))
          );

          await Promise.all(
            selected.map((id) => axiosInstance.patch(`posts/${id}/published/adac`))
          );

          setSelected([]);

          loadNotes({ tab: 3 });
        }}
        title="¿Desea enviar la nota a ADAC?"
        titleSend="Enviar"
        successTitle="Nota Enviada exitosamente"
      />
      <SendDialog
        open={openDelete}
        setOpen={setOpenDelete}
        handleclickSaved={handleConfirmDelete}
        title="¿Está seguro de que desea eliminar las notas seleccionadas?"
        titleSend="Eliminar"
        successTitle="Notas eliminadas exitosamente"
      />
    </Box>
  );
};

export default ArticlesTable;
