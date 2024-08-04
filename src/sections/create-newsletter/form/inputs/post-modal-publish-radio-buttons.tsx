/* eslint-disable no-unneeded-ternary */
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { useField } from 'formik';
import { useLocales } from 'src/locales';

interface IPublishRadioButtons {
  name: string;
}

export default function PublishRadioButtons({ name }: IPublishRadioButtons) {
  const [field, , helpers] = useField(name);
  const { t } = useLocales();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(event.target.value === 'Programar' ? false : true);
  };

  return (
    <RadioGroup
      row
      color="info"
      value={!field.value ? 'Programar' : 'Publicar ahora'}
      onChange={handleChange}
      sx={{
        padding: '0 10px',
      }}
    >
      <FormControlLabel
        value="Programar"
        control={<Radio color="info" />}
        label={t('Dashboard.Create_Newsletter.Create.Modal.Program')}
      />
      <FormControlLabel
        value="Publicar ahora"
        control={<Radio color="info" />}
        label={t('Dashboard.Create_Newsletter.Create.Modal.Publish_now')}
      />
    </RadioGroup>
  );
}
