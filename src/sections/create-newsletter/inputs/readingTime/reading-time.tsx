import type { RootState } from 'src/store';

import { useSelector } from 'react-redux';

import { Box } from '@mui/material';

import type { TextInput } from '../types';

interface ReadingTimeProps {
  templateId: string;
  inputId: string;
  inputIdtext: string;
  isEmail?: boolean;
}

export default function ReadingTime({
  templateId,
  inputId,
  inputIdtext,
  isEmail,
}: ReadingTimeProps) {
  const currentNewsletter = useSelector((state: RootState) => state.newsletter.currentNewsletter);

  const currentInput = currentNewsletter
    .find((item) => item.templateId === templateId)
    ?.inputs.find((item) => item.inputId === inputIdtext && item.type === 'text') as TextInput;

  type ingTimeProps = {
    text: string;
    wordsPerMinute: number;
  };

  const calculateingTime = ({ text, wordsPerMinute }: ingTimeProps) => {
    const words = text.split(/\s+/).filter((word) => word !== '');

    const wordCount = words.length;

    const ingTimeMinutes = wordCount / wordsPerMinute;

    return ingTimeMinutes;
  };

  if (isEmail) {
    return (
      <div
        style={{
          color: '#595959',
          fontSize: '10px',
        }}
      >
        {`-${calculateingTime({ text: currentInput.value, wordsPerMinute: 250 }).toFixed(
          2
        )} min lectura - ${new Date().toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}`}
      </div>
    );
  }

  return (
    <Box>
      {`- ${calculateingTime({ text: currentInput.value, wordsPerMinute: 250 }).toFixed(
        2
      )} min lectura - ${new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`}
    </Box>
  );
}
