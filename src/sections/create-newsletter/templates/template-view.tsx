import type { RootState } from 'src/store';

import { useSelector } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';

import { Box } from '@mui/material';

import { TEMPLATESNAMES } from 'src/const/neswletter/templates';

import { Iconify } from 'src/components/iconify';

import LayoutTemplate from './template-layout';
import LayoutDragable from '../inputs/LayoutDragable';
import TemplateInputs from '../inputs/newsletter-templates-inputs';

import type { TypeTemplateContent } from '../inputs/types';

const RenderInput = ({ isEmail, item, index, qtyInputs }: any) => {
  const isLast = qtyInputs && index === qtyInputs - 1;
  return (
    <table
      style={{
        width: '100%',
        marginBottom: isLast ? '0px' : '22px',
        borderSpacing: '0px',
      }}
    >
      <tr style={{ width: '100%' }}>
        <td style={{ width: '100%' }}>
          <TemplateInputs key={item.type + index} isEmail={isEmail} {...item} />
        </td>
      </tr>
    </table>
  );
};

const RenderInputOutSide = ({ isEmail, item, index }: any) => (
  <TemplateInputs key={item.type + index} isEmail={isEmail} {...item} />
);

interface ILayoutTemplate {
  templateId: string;
  name: string;
  inputs: TypeTemplateContent[];
  isEmail?: boolean;
  color: string;
  bgColor: string;
}

export default function TemplateView({
  isEmail,
  inputs,
  templateId,
  name,
  color,
  bgColor,
}: ILayoutTemplate) {
  const outsideInputs = inputs
    .filter((item) => item.type === 'image' && item?.outside)
    .map((item, index) => RenderInputOutSide({ isEmail, item, index }));

  const insideInputs = inputs
    .filter((item) => !(item.type === 'image' && item?.outside))
    .map((item, index) =>
      RenderInput({
        isEmail,
        item,
        index,
        qtyInputs: inputs.filter((item2) => !(item2.type === 'image' && item2?.outside)).length,
      })
    );

  return (
    <>
      {outsideInputs}

      <LayoutTemplate
        templateId={templateId}
        name={name}
        isEmail={isEmail}
        color={color}
        bgColor={bgColor}
      >
        {isEmail || name !== TEMPLATESNAMES.Blank ? (
          insideInputs
        ) : (
          <InputsDragable
            inputs={inputs}
            templateId={templateId}
            name={name}
            isEmail={isEmail}
            color={color}
            bgColor={bgColor}
          />
        )}
      </LayoutTemplate>
    </>
  );
}

/// inputs dragables solo para el template blank

const InputsDragable = ({ inputs, templateId, name, isEmail, color, bgColor }: ILayoutTemplate) => {
  const deleteItem = useSelector((state: RootState) => state.note.deleteItem);
  return (
    <LayoutDragable templateId={templateId} name={name}>
      {inputs
        .filter((item) => !(item.type === 'image' && item?.outside))
        .map((item, index) => (
          <Draggable key={item.inputId} draggableId={item.inputId} index={index}>
            {(provided, snapshot) => (
              <Box
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                width={1}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    position: 'relative',
                    opacity: snapshot.isDragging ? 0.5 : 1,
                  }}
                >
                  {snapshot.isDragging && deleteItem && (
                    <Box
                      sx={{
                        position: 'absolute',
                        borderRadius: '15px',
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                        top: 0,
                        left: 0,
                        backgroundColor: 'rgba(206, 20, 20, 0.55)',
                      }}
                    />
                  )}
                  {item.type !== 'addInput' && (
                    <Box
                      sx={{
                        opacity: 0.5,
                      }}
                    >
                      <Iconify
                        icon="icon-park-outline:drag"
                        style={{
                          position: 'absolute',
                          left: '-20px',
                          cursor: 'move',
                          top: 'calc(50% - 10px)',
                          transform: 'translateY(-30%)',
                        }}
                      />
                    </Box>
                  )}
                  <RenderInput
                    isEmail={isEmail}
                    item={item}
                    index={index}
                    qtyInputs={inputs.length}
                  />
                </Box>
              </Box>
            )}
          </Draggable>
        ))}
    </LayoutDragable>
  );
};
