import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { CircularProgress, SpeedDialIcon, Tooltip } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import { green } from '@mui/material/colors';
import { RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import { useAxios } from 'src/auth/context/axios/axios-provider';
import { endpoints_adam } from 'src/utils/axios';
import axios from 'axios';
import { setNeswletterList } from 'src/store/slices/newsletter';
import { useSnackbar } from 'notistack';
import { setUrlNgrok, setpromptIa } from 'src/store/slices/note';
import NoteDialog from './modal/CreateAi';
import TrenddingDialog, { Data } from './modal/trending';
import DialogAlert from './modal/DialogAlert';
import useNotes from './useNotes';

const emailsReviewError = ['97.rramirez@gmail.com', 'jolcusuario1@gmail.com'];

const OptionsCreateNota: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  const [messageLoading, setMessageLoading] = React.useState('');
  const [openIaNoteDialog, setOpenIaNoteDialog] = React.useState(false);
  const [openChangeDialog, setOpenChangeDialog] = React.useState(false);
  const [openTrendding, setOpenTrendding] = React.useState(false);
  const [openDialogAlert, setOpenDialogAlert] = React.useState(false);
  const [trenddingsData, setTrenddingsData] = React.useState<Data>({
    mexico: { title: '', topics: [] },
    usa: { title: '', topics: [] },
    reddit: { title: '', topics: [] },
  });

  const { enqueueSnackbar } = useSnackbar();

  const promptIa = useSelector((state: RootState) => state.note.promptIa);
  const urlngrok = useSelector((state: RootState) => state.note.urlngrok);
  const axiosinstance = useAxios();
  const dispatch = useDispatch();

  const { loadNotes } = useNotes();

  const handleClickCreateNote = (source: 'ceateNoteIA' | 'changeNgrokUrl') => {
    if (openIaNoteDialog || loading) return;

    if (source === 'ceateNoteIA') {
      setOpenIaNoteDialog(true);
    } else if (source === 'changeNgrokUrl') {
      setOpenChangeDialog(true);
    }
  };

  const handleChangePromptIa = async ({ value }: { value: string }) => {
    setOpenIaNoteDialog(false);
    setLoading(true);
    setMessageLoading('Cargando Noticias con IA...');

    try {
      const { data } = await axiosinstance.get(endpoints_adam.ngrok);
      const ngrokUrl = data[0]?.url;

      if (!ngrokUrl) {
        throw new Error('No ngrok URL provided');
      }

      const response = await axios.post(`${ngrokUrl}${endpoints_adam.back_jorge.createNoteIA}`, {
        searchTrendingNews: value,
      });

      if (response.data.statusCode === 200) {
        if (response.data.data.length === 0) {
          enqueueSnackbar(`No se encontraron noticias con el término de búsqueda: "${value}"`, {
            variant: 'error',
            persist: true,
          });
          return;
        }
      }

      enqueueSnackbar('Notas creadas con éxito', { variant: 'success', persist: true });
      loadNotes({ tab: 0 });
      dispatch(setpromptIa('')); // Limpiar promptIa después de la ejecución
    } catch (error: any) {
      handleError(
        'Error al crear notas IA',
        'Actualizar ngrok',
        'Por favor actualiza el ngrok en el Frontend',
        emailsReviewError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClickDeleteAll = async () => {
    setOpenDialogAlert(false);
    setLoading(true);
    setMessageLoading('Borrando borradores...');

    try {
      const { data } = await axiosinstance.get(endpoints_adam.ngrok);
      const ngrokUrl = data[0]?.url;

      if (!ngrokUrl) {
        throw new Error('No ngrok URL provided');
      }

      await axios.post(`${ngrokUrl}${endpoints_adam.back_jorge.deleteAllDrafts}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
          Accept: '*/*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
        },
      });
      enqueueSnackbar('Borradores eliminados con éxito', { variant: 'success', persist: true });
    } catch (error: any) {
      handleError(
        'Error al eliminar borradores',
        'Actualizar ngrok',
        'Por favor actualiza el ngrok en el Frontend',
        emailsReviewError
      );
    } finally {
      setLoading(false);
    }
  };

  const handleError = async (
    message: string,
    subject?: string,
    content?: string,
    emails?: string[]
  ) => {
    enqueueSnackbar(message, { variant: 'error', persist: true });

    if (subject && content && emails) {
      const data = { subject, content, emails };
      try {
        const emailResponse = await axiosinstance.post(`${endpoints_adam.email}`, data);
        console.log('Envío de correo:', emailResponse);
      } catch (emailError) {
        console.error('Error al enviar correo:', emailError);
      }
    }
  };

  const handleChangeUrlNgrok = async ({ value }: { value: string }) => {
    setOpenChangeDialog(false);
    setLoading(true);
    setMessageLoading('Cambiando url ngrok...');

    try {
      const { data } = await axiosinstance.get(endpoints_adam.ngrok);
      const ngrokId = data[0]?.id;

      if (!ngrokId) {
        throw new Error('No ngrok ID provided');
      }

      await axiosinstance.patch(`${endpoints_adam.ngrok}/${ngrokId}`, { url: value });
      enqueueSnackbar('Url ngrok cambiada con éxito', { variant: 'success', persist: true });
    } catch (error: any) {
      handleError('Error al cambiar url ngrok');
    } finally {
      setLoading(false);
      dispatch(setUrlNgrok(''));
    }
  };

  const handleClickTrendding = async () => {
    setOpenIaNoteDialog(false);
    setLoading(true);
    setMessageLoading('Cargando Tendencias...');

    try {
      const { data } = await axiosinstance.get(endpoints_adam.ngrok);
      const ngrokUrl = data[0]?.url;

      if (!ngrokUrl) {
        throw new Error('No ngrok URL provided');
      }

      const trendd = await axios.get(`${ngrokUrl}${endpoints_adam.back_jorge.trenddingNews}`, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'ngrok-skip-browser-warning': 'true',
          Accept: '*/*',
          'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, PATCH, OPTIONS',
        },
      });
      setTrenddingsData(trendd.data);
      setOpenTrendding(true);
    } catch (error: any) {
      handleError(
        'Error al crear notas IA',
        'Actualizar ngrok',
        'Por favor actualiza el ngrok en el Frontend',
        emailsReviewError
      );
    } finally {
      setLoading(false);
    }
  };

  const promptIaExecuted = React.useRef(false);
  const urlngrokExecuted = React.useRef(false);

  React.useEffect(() => {}, [promptIa, urlngrok]);

  const actions = [
    {
      icon: <ElectricBoltIcon />,
      name: 'Crear Notas IA',
      onClick: () => handleClickCreateNote('ceateNoteIA'),
    },
    { icon: <WhatshotIcon />, name: 'Trendding', onClick: () => handleClickTrendding() },
    { icon: <DeleteForeverIcon />, name: 'Borrar Todo', onClick: () => setOpenDialogAlert(true) },
    {
      icon: <BuildIcon />,
      name: 'Cambiar url ngrok',
      onClick: () => handleClickCreateNote('changeNgrokUrl'),
    },
  ];

  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial openIcon example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={
          <Tooltip title={messageLoading} placement="left">
            <SpeedDialIcon />
          </Tooltip>
        }
      >
        {!loading &&
          actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={action.onClick}
            />
          ))}
      </SpeedDial>

      <Box sx={{ position: 'absolute', bottom: 72, right: 72 }}>
        {loading && (
          <CircularProgress
            size={68}
            sx={{
              color: green[500],
              position: 'absolute',
              top: -6,
              left: -6,
              zIndex: 1,
            }}
          />
        )}
      </Box>

      <NoteDialog
        open={openIaNoteDialog}
        setOpen={setOpenIaNoteDialog}
        title="Crear Notas IA"
        subTitle="Ingresa el termino de busqueda para crear notas IA"
        submitTitle="Generar"
        labelInput="Termino de busqueda"
        onSubmit={(event: any) => {
          event.preventDefault();
          if (!event.currentTarget.prompt.value) return;
          if (!event.currentTarget.prompt.value.length) return;
          handleChangePromptIa({ value: event.currentTarget.prompt.value });
          setOpenIaNoteDialog(false);
        }}
      />

      <NoteDialog
        open={openChangeDialog}
        setOpen={setOpenChangeDialog}
        title="Cambiar url ngrok"
        labelInput="Url ngrok"
        subTitle="Ingresa la nueva url de ngrok"
        submitTitle="Cambiar"
        onSubmit={(event: any) => {
          event.preventDefault();
          if (!event.currentTarget.prompt.value) return;
          if (!event.currentTarget.prompt.value.length) return;
          handleChangeUrlNgrok({ value: event.currentTarget.prompt.value });
          setOpenChangeDialog(false);
        }}
      />

      <TrenddingDialog data={trenddingsData} open={openTrendding} setOpen={setOpenTrendding} />

      <DialogAlert
        open={openDialogAlert}
        setOpen={setOpenDialogAlert}
        title="Seguro que desea ELIMINAR los borradores?"
        subTitle="Si elimina los borradores no podrá recuperarlos"
        submitTitle="Eliminar"
        onSubmit={handleClickDeleteAll}
      />
    </Box>
  );
};

export default OptionsCreateNota;