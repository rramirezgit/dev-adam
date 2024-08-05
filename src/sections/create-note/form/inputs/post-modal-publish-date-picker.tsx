import { DatePicker } from "@mui/x-date-pickers";
import { useField } from "formik";
import { useLocales } from "src/locales";

interface IPublishDatePicker {
  name: string;
}
export default function PublishDatePicker({ name }: IPublishDatePicker) {
  const [field, , helpers] = useField(name);
  const { t } = useLocales();
  return (
    <DatePicker
      value={field.value}
      onChange={value => helpers.setValue(value)}
      label={t("Dashboard.Create_Nota.Create.Modal.Program")}
      sx={{
        width: "50%",
      }}
    />
  );
}
