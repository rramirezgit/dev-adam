import { useField } from 'formik';

import { DatePicker } from '@mui/x-date-pickers';

interface IPublishDatePicker {
  name: string;
}
export default function PublishDatePicker({ name }: IPublishDatePicker) {
  const [field, , helpers] = useField(name);
  return (
    <DatePicker
      value={field.value}
      onChange={(value) => helpers.setValue(value)}
      label="Publish Date"
      sx={{
        width: '50%',
      }}
    />
  );
}
