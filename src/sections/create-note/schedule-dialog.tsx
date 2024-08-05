import { LoadingButton } from "@mui/lab";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import dayjs, { Dayjs } from "dayjs";
import { DateCalendar, MobileTimePicker } from "@mui/x-date-pickers";
import utc from "dayjs/plugin/utc";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "src/store";
import { useResponsive } from "src/hooks/use-responsive";
import DialogoSucces from "./dialog-succes";
import SendDialogSubs from "./send-dialog-subs";

interface ScheduleDialogProps {
  open: boolean;
  onClose: () => void;
  sendEmail: (s: string) => Promise<void>;
  handleClickSchedule: any;
}

export default function ScheduleDialog({
  open,
  onClose,
  sendEmail,
  handleClickSchedule,
}: ScheduleDialogProps) {
  const [openSucces, setOpenSucces] = useState(false);
  const [openSend, setOpenSend] = useState(false);
  const [selectedH, setSelectedH] = useState<any>(
    // sumano dos minutos
    new Date(dayjs().add(3, "minute").format("YYYY-MM-DDTHH:mm:ss"))
  );
  const [value, setValue] = useState<any>(new Date());
  const [loading, setLoading] = useState(false);
  const [errorDate, setErrorDate] = useState<string | null>(null);

  const NotaList = useSelector((state: RootState) => state.note.neswletterList);

  const smUp = useResponsive("up", "md");

  useEffect(() => {
    if (!openSend) {
      const list = NotaList;

      onClose();
    }
  }, [openSend]);

  useEffect(() => {
    if (!openSucces) {
      onClose();
    }
  }, [openSucces]);

  useEffect(() => {
    // La fecha y hora deben ser mayores a la actual por 2 minutos
    if (value && selectedH) {
      const selectedHour = dayjs(selectedH, "HH:mm");

      // Le resto 2 minutos a la hora actual para que no se pueda programar en el mismo minuto
      const adjustedHour = selectedHour.subtract(2, "minute").format("HH:mm");

      const now = dayjs();
      const h = adjustedHour.split(":")[0];
      const m = adjustedHour.split(":")[1];
      const dateSchedule = dayjs(value).hour(Number(h)).minute(Number(m));

      if (now.isBefore(dateSchedule)) {
        setErrorDate(null);
      } else {
        setErrorDate(
          "La fecha y hora deben ser mayores a la actual por 2 minutos"
        );
      }
    }
  }, [value, selectedH]);

  const sendButton = (
    <LoadingButton
      loading={loading}
      fullWidth
      sx={{ height: 48 }}
      loadingPosition="start"
      variant="outlined"
      color="primary"
      onClick={() => {
        setOpenSend(true);
      }}
    >
      Enviar ahora sin programar
    </LoadingButton>
  );

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogContent sx={{ p: 5 }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            {smUp && (
              <DateCalendar
                value={value}
                onChange={newValue => setValue(newValue)}
              />
            )}
            {!smUp && sendButton}
          </Grid>

          <Grid xs={12} md={6}>
            <Box
              component={Paper}
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                height: "100%",
              }}
            >
              {smUp && sendButton}
              <Divider sx={{ my: 0 }} />
              <DialogTitle
                align="center"
                sx={{
                  py: 0,
                }}
              >
                Programar Email
              </DialogTitle>
              <Typography
                sx={{ fontSize: "14px", color: "#919EAB", textAlign: "center" }}
              >
                Selecciona la fecha y horario que deseas programar
              </Typography>
              {!smUp && (
                <DateCalendar
                  value={value}
                  onChange={newValue => setValue(newValue)}
                />
              )}
              <Box width={1}>
                <MobileTimePicker
                  sx={{ width: "100%" }}
                  label="Selecciona una Hora"
                  openTo="hours"
                  value={selectedH}
                  ampm
                  onChange={e => {
                    setSelectedH(e);
                  }}
                />
                {errorDate && (
                  <Typography color="error" sx={{ fontSize: "12px" }}>
                    {errorDate}
                  </Typography>
                )}
              </Box>
              <Stack spacing={2} direction="row" justifyContent="space-between">
                <LoadingButton
                  loading={false}
                  fullWidth
                  sx={{ height: 48 }}
                  loadingPosition="start"
                  variant="outlined"
                  color="primary"
                  onClick={onClose}
                >
                  Cancelar
                </LoadingButton>
                <LoadingButton
                  loading={loading}
                  disabled={selectedH === 0 || !value}
                  fullWidth
                  sx={{ height: 48 }}
                  loadingPosition="start"
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    const horaFormat: any = dayjs(selectedH).format("HH:mm");

                    dayjs.extend(utc);

                    const h = horaFormat.split(":")[0];
                    const m = horaFormat.split(":")[1];
                    const dateH = dayjs(value)
                      .hour(Number(h))
                      .minute(Number(m));

                    if (dayjs().isBefore(dateH)) {
                      setErrorDate(null);
                    } else {
                      setErrorDate(
                        "La fecha y hora deben ser mayores a la actual por 2 minutos"
                      );
                      return;
                    }

                    handleClickSchedule({ date: dateH.utc().format() }).then(
                      (res: any) => {
                        if (res) {
                          setOpenSucces(true);
                        }
                      }
                    );
                  }}
                >
                  Programar
                </LoadingButton>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <SendDialogSubs
        open={openSend}
        setOpen={setOpenSend}
        sendEmail={sendEmail}
      />
      <DialogoSucces open={openSucces} setOpen={setOpenSucces} />
    </Dialog>
  );
}
