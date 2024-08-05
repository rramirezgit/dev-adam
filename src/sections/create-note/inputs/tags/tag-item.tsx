import { useState } from 'react';
import { Iconify } from 'src/components/iconify';
import { alpha, useTheme } from '@mui/material';
import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import { RootState } from 'src/store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTagNota, setErrors } from 'src/store/slices/noteStore';
import TextBubble from '../bubbles/bubble';

interface ItemProps {
  color?: string;
  [key: string]: any;
}

export default function TagItem({ color = DEFAULT_COLOR_NESWLETTER, ...props }: ItemProps) {
  const [opacity, setOpacity] = useState(0);

  const theme = useTheme();

  const dispatch = useDispatch();

  const errors = useSelector((state: RootState) => state.note.errors);

  const haveErrors = errors.find((item) => item.inputId === props.tag.inputId);

  const handleClickDeleteTag = (tagId: string) => {
    dispatch(
      deleteTagNota({
        templateId: props.templateId,
        inputId: props.inputId,
        tagId,
      })
    );
    const newErrors = errors.filter((item) => item.inputId !== tagId);

    dispatch(setErrors(newErrors));
  };

  // const color =
  // currentNota.find((item) => item.templateId === props.templateId)?.color || // esto tomaba el color del template
  // DEFAULT_COLOR_NESWLETTER;

  return (
    <td
      style={{
        minWidth: '80px',
        position: 'relative',
      }}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
    >
      {!props.isEmail && (
        <div
          id={props.tag.inputId}
          style={{
            cursor: 'pointer',
            opacity,
            position: 'absolute',
            top: '-6px',
            left: '-6px',
            transition: 'all 0.2s ease',
            backgroundColor: theme.palette.grey[400],
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onClickCapture={(e) => handleClickDeleteTag(e.currentTarget.id)}
        >
          <Iconify icon="fluent-mdl2:cancel" color="white" width={10} />
        </div>
      )}

      <div
        style={{
          backgroundColor: haveErrors ? alpha(theme.palette.error.main, 0.8) : color,
          borderRadius: '5px',
          padding: '4px',
          width: '100%',
          maxHeight: '24px',
          color: 'white',
        }}
      >
        <TextBubble
          name={props.tag.name}
          parentId={props.tag.parentId}
          placeholder={props.tag.placeholder}
          style={props.tag.style}
          variant={props.tag.variant}
          value={props?.tag.value}
          inputId={props.tag.inputId}
          maxLength={props.tag.maxLength}
          minLength={props.tag.minLength}
          isEmail={props.isEmail}
          templateId={props.tag.templateId}
          type={props.tag.type}
          errorName={props.tag.errorName}
        />
      </div>
    </td>
  );
}
