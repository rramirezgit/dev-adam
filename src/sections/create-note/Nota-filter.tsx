// @mui
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
// types
import { IPostFilters, ISocialnetworks, PostFilterValue } from 'src/types/post';

// components
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { ButtonBase } from '@mui/material';
import { SOCIALNETWORKS } from 'src/const/post/redes';
import { useCallback, useState } from 'react';
import { useLocales } from 'src/locales';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { INotasFilters } from 'src/types/Nota';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onOpen: VoidFunction;
  onClose: VoidFunction;
  //
  filters: INotasFilters;
  onFilters: (name: string, value: PostFilterValue) => void;
  //
  canReset: boolean;
  onResetFilters: VoidFunction;
  //
  socialNetworks: ISocialnetworks[];
  // serviceOptions: string[];
  // tourGuideOptions: ITourGuide[];
  // destinationOptions: {
  //   code: string;
  //   label: string;
  //   phone: string;
  //   suggested?: boolean;
  // }[];
  //
  dateError: boolean;
};

export default function Newsfilter({
  open,
  onOpen,
  onClose,
  //
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  socialNetworks, //
  dateError,
}: Props) {
  const { t } = useLocales();

  const [origin, setOrigin] = useState<string>('');

  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        {t('Dashboard.Create_Nota.Create.filters.Title')}
      </Typography>

      <Tooltip title="Reset">
        <IconButton onClick={onResetFilters}>
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="solar:restart-bold" />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={onClose}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );

  const handleSelect = useCallback(
    (name: string) => {
      if (filters.origin === name) {
        onFilters('origin', '');
        return;
      }

      onFilters('origin', name);
    },
    [filters.origin, onFilters]
  );

  const renderSocialNetworks = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Origen
      </Typography>
      <Stack
        direction="row"
        display="inline-flex"
        spacing={1}
        sx={{
          flexWrap: 'wrap',
        }}
      >
        {[
          {
            name: 'ADAC',
            color: '#EDEDED',
          },
          {
            name: 'AI',
            color: '#CDEBFF',
          },
        ].map((social) => {
          const hasSelected = filters.origin ? filters.origin.includes(social.name) : false;
          return (
            <ButtonBase
              key={social.name}
              sx={{
                width: 36,
                height: 36,
                borderRadius: '30%',
              }}
              onClick={() => {
                handleSelect(social.name);
              }}
            >
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 25,
                  height: 25,
                  position: 'relative',
                  background: `url(/assets/icons/note/${social.name}.svg) no-repeat center center`,
                  backgroundSize: 'cover', // 'cover' | 'contain' | 'initial' | 'inherit'
                  ...(hasSelected && {
                    transform: 'scale(1.1)',
                    transition: (theme) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }),
                }}
              >
                <Iconify
                  width={hasSelected ? 20 : 0}
                  icon="tabler:point-filled"
                  sx={{
                    position: 'absolute',
                    top: '-10px',
                    left: '13px',
                    color: (theme) => theme.palette.success.main,
                    transition: (theme) =>
                      theme.transitions.create('all', {
                        duration: theme.transitions.duration.shortest,
                      }),
                  }}
                />
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>
    </Stack>
  );

  const handleFilterEndDate = useCallback(
    (newValue: Date | null) => {
      newValue?.setHours(23, 59, 59);

      onFilters('endDate', newValue);
    },
    [onFilters]
  );

  const handleFilterStartDate = useCallback(
    (newValue: Date | null) => {
      onFilters('creationDate', newValue);
    },
    [onFilters]
  );

  const renderDateRange = (
    <Stack>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        {t('Dashboard.Create_Nota.Create.filters.date')}
      </Typography>
      <Stack spacing={2.5}>
        <DatePicker
          label="Fecha de Creación"
          value={filters.creationDate}
          onChange={handleFilterStartDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError && 'No hay Notas en esta fecha',
            },
          }}
        />

        {/* <DatePicker
          label={t('Dashboard.Create_Nota.Create.filters.endDate')}
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{
            textField: {
              error: dateError,
              helperText: dateError && 'End date must be later than start date',
            },
          }}
        /> */}
      </Stack>
    </Stack>
  );

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        endIcon={
          <Badge color="error" variant="dot" invisible={!canReset}>
            <Iconify icon="ic:round-filter-list" />
          </Badge>
        }
        onClick={onOpen}
      >
        {t('Dashboard.Create_Nota.Create.filters.Title')}
      </Button>

      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 280 },
        }}
      >
        {renderHead}

        <Divider />

        <Scrollbar sx={{ px: 2.5, py: 3 }}>
          <Stack spacing={3}>
            {/* 

            {renderDestination}

            {renderTourGuide}

            {renderServices} */}

            {renderSocialNetworks}
            {renderDateRange}
          </Stack>
        </Scrollbar>
      </Drawer>
    </>
  );
}
