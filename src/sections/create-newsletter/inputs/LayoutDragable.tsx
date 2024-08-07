import type { DropResult } from '@hello-pangea/dnd';

import { m } from 'framer-motion';
import { useDispatch } from 'react-redux';
import React, { useState, useCallback } from 'react';
import { Droppable, DragDropContext } from '@hello-pangea/dnd';

import { Box, useTheme } from '@mui/material';

import { deleteInputNewsletter, reorderInputNewsletter } from 'src/store/slices/newsletterStore';

// import { setDeleteItem } from 'src/store/slices/noteStore';
import { Iconify } from 'src/components/iconify';

interface LayoutDragableProps {
  templateId: string;
  name: string;
  children: any;
}

export default function LayoutDragable({ templateId, name, children }: LayoutDragableProps) {
  const [isShowingBin, setIsShowingBin] = useState(false);

  const theme = useTheme();

  const dispatch = useDispatch();

  const onDragEnd = useCallback(async ({ destination, source, draggableId, type }: DropResult) => {
    try {
      setIsShowingBin(false);
      if (!destination) {
        return;
      }

      if (destination.droppableId === source.droppableId && destination.index === source.index) {
        return;
      }
      if (destination?.droppableId === 'bin') {
        dispatch(deleteInputNewsletter({ templateId, index: source.index }));
        return;
      }

      dispatch(
        reorderInputNewsletter({
          templateId,
          currentIndex: source.index,
          newIndex: destination.index,
        })
      );
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <DragDropContext onDragEnd={onDragEnd} onBeforeCapture={() => setIsShowingBin(true)}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <Box {...provided.droppableProps} ref={provided.innerRef} width={1}>
            {children}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>

      {isShowingBin ? (
        <m.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div
            style={{
              position: 'absolute',
              height: '100%',
              top: 5,
              zIndex: 999,
              left: -85,
            }}
          >
            <Droppable droppableId="bin">
              {(provided, snapshot) => 
                // dispatch(setDeleteItem(snapshot.isDraggingOver));
                 (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    style={{
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: 65,
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Iconify icon="iconoir:trash" color="white" />
                    </div>
                  </div>
                )
              }
            </Droppable>
          </div>
        </m.div>
      ) : null}
    </DragDropContext>
  );
}
