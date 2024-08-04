import { TextField } from '@mui/material';
import styled from '@emotion/styled';
import styles from './colorPicker.module.css';

export const StyledInput = styled(TextField)({
  width: '50%',
});

interface Props {
  label: string;
  name: string;
  onChange?: (e: any) => void;
  value?: string;
}

export default function ColorPicker({ label, name, onChange, value }: Props) {
  return (
    <div className={styles.wrap}>
      <div>{label}</div>
      <StyledInput
        type="text"
        variant="standard"
        size="small"
        fullWidth
        placeholder="#"
        onChangeCapture={onChange}
        name={name}
        value={value}
      />
      <div
        className={styles.buttonColor}
        style={{
          backgroundColor: value,
          boxShadow: `black 0px 0px 3px 0px`,
          cursor: 'pointer',
        }}
      >
        <TextField type="color" sx={{ opacity: 0 }} value={value} onChangeCapture={onChange} />
      </div>
    </div>
  );
}
