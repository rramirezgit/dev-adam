import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import { Iconify } from 'src/components/iconify';
import { addTagNota, setErrors } from 'src/store/slices/noteStore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import uuidv4 from 'src/utils/uuidv4';
import { alpha } from '@mui/system';
import { useTheme } from '@mui/material';

interface ItemProps {
  color?: string;
  [key: string]: any;
}

export default function AddTags({ color = DEFAULT_COLOR_NESWLETTER, ...props }: ItemProps) {
  const dispatch = useDispatch();

  const theme = useTheme();

  const currentNota = useSelector((state: RootState) => state.note.currentNota);
  const errors = useSelector((state: RootState) => state.note.errors);

  const currentInput = currentNota
    .find((item) => item.templateId === props.templateId)
    ?.inputs.find((item) => item.inputId === props.inputId && item.type === 'tags');

  const tags = currentInput?.type === 'tags' ? currentInput.tags : [];

  const haveErrors = errors.find((item) => item.inputId === props.inputId);

  // const color =
  //   // currentNota.find((item) => item.templateId === props.templateId)?.color || // esto tomaba el color del template
  //   DEFAULT_COLOR_NESWLETTER;

  const handleClickAddTag = () => {
    dispatch(
      addTagNota({
        templateId: props.templateId,
        inputId: props.inputId,
        inputTag: {
          type: 'tags',
          variant: 'tags',
          placeholder: 'Text..',
          errorName: 'tag',
          inputId: uuidv4(),
          parentId: props.inputId,
          value: '',
          // minLength: 5,
          // maxLength: 15,
          templateId: props.templateId,
          name: props.name,
          style: {
            padding: 0,
            fontSize: 12,
          },
        },
      })
    );

    const newErrors = errors.filter((item) => item.inputId !== props.inputId);

    dispatch(setErrors(newErrors));
  };

  if (tags.length > 3) return <></>;

  return (
    <td
      style={{
        minWidth: '20px',
        cursor: 'pointer',
        position: 'relative',
      }}
      onClickCapture={handleClickAddTag}
    >
      <div
        style={{
          backgroundColor: haveErrors ? theme.palette.error.main : color,
          borderRadius: '8px',
          padding: '2px 8px',
          color: 'white',
          minWidth: '11%',
          height: '23.88px',
        }}
      >
        <Iconify icon="ph:plus-bold" color="white" width={20} />
      </div>
    </td>
  );
}
