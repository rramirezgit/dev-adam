'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { headerContent } from 'src/sections/create-newsletter/templates/header/header-content';
import {
  TypeTemplateContent,
  TagInput,
  valueImageNeswletter,
} from 'src/sections/create-newsletter/inputs/types';
import { FooterContent } from 'src/sections/create-newsletter/templates/footer/footer-content';
import { imageCrop, NeswletterState, newsletterItemList, Tmenudata } from 'src/types/newsletter';

const initialState: NeswletterState = {
  menuData: { type: 'none', templateId: '', inputId: 'string', parentId: 'string' },
  //
  selectedNewsletter: '',
  neswletterList: [],

  styles: {
    main: '#00C3C3',
  },

  currentNewsletter: [headerContent('header'), FooterContent('footer')],
  currentNewsletterId: '',
  currentNewsletterImagesList: [],
  errors: [],

  // image crop
  dataImageCrop: null,
  dataImageCroped: null,
  emails: [],
  header: true,
  showEditor: false,
  deleted: false,
  subject: 'ADAC',

  showAprove: false,

  imageSaved: true,
  objectFit: 'cover',
};

export const NewsletterSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setShowEditor: (state, action: PayloadAction<boolean>) => {
      state.showEditor = action.payload;
    },
    setMenu: (state, action: PayloadAction<Tmenudata>) => {
      state.menuData = action.payload;
    },
    setSelectedNewsletter: (state, action: PayloadAction<string>) => {
      state.selectedNewsletter = action.payload;
    },
    setNeswletterList: (state, action: PayloadAction<newsletterItemList[]>) => {
      state.neswletterList = action.payload;
    },
    setStylesNewsletter: (state, action: PayloadAction<any>) => {
      state.styles = action.payload;
    },
    setcurrentNewsletter: (state, action: PayloadAction<any>) => {
      state.currentNewsletter = action.payload;
    },
    updateValueInputNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        value: string;
        parentId?: string | null;
      }>
    ) => {
      const { templateId, inputId, value, parentId } = action.payload;

      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === templateId) {
          return {
            ...item,
            inputs: item.inputs.map((input) => {
              if (input.type === 'tags' && input.inputId === parentId) {
                return {
                  ...input,
                  tags: input?.tags.map((tag) => {
                    if (tag.inputId === inputId) {
                      return {
                        ...tag,
                        value,
                      };
                    }
                    return tag;
                  }),
                };
              }
              if (input.inputId === parentId && input.type === 'layout') {
                return {
                  ...input,
                  inputs: input.inputs.map((input2) => {
                    if (input2.inputId === inputId) {
                      return {
                        ...input2,
                        value,
                      };
                    }
                    return input2;
                  }),
                };
              }
              if (input.inputId === inputId && input.type !== 'tags' && input.type !== 'layout') {
                return {
                  ...input,
                  value,
                };
              }
              return input;
            }),
          };
        }
        return item;
      });
    },

    /// tags
    addNewInputNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        input: TypeTemplateContent;
      }>
    ) => {
      const { templateId, input } = action.payload;
      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === templateId) {
          return {
            ...item,
            inputs: [
              ...(item.inputs.filter((item2) => item2.type !== 'addInput') || []),
              {
                ...input,
              },
              ...(item.inputs.filter((item2) => item2.type === 'addInput') || []),
            ],
          };
        }
        return item;
      });

      const error =
        state.errors.find((item) => item.templateId === templateId)?.message ===
        'Debe cargar al menos un input';

      if (error) {
        state.errors = state.errors.filter(
          (item) =>
            item.templateId !== templateId && item.message !== 'Debe cargar al menos un input'
        );
      }
    },
    addTagNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        inputTag: TagInput;
      }>
    ) => {
      const { templateId, inputId, inputTag } = action.payload;
      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === templateId) {
          return {
            ...item,
            inputs: item.inputs.map((input) => {
              if (input.inputId === inputId && input.type === 'tags') {
                return {
                  ...input,
                  tags: [...input.tags, { ...inputTag }],
                };
              }
              return input;
            }),
          };
        }
        return item;
      });
    },
    deleteTagNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        tagId: string;
      }>
    ) => {
      const { templateId, inputId, tagId } = action.payload;
      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === templateId) {
          return {
            ...item,
            inputs: item.inputs.map((input) => {
              if (input.inputId === inputId && input.type === 'tags') {
                return {
                  ...input,
                  tags: input.tags.filter((tag) => tag.inputId !== tagId),
                };
              }
              return input;
            }),
          };
        }
        return item;
      });
    },

    /// errors
    setErrors: (state, action: PayloadAction<any>) => {
      state.errors = action.payload;
    },

    /// Image crop
    setDataImageCrop: (state, action: PayloadAction<imageCrop>) => {
      state.dataImageCrop = action.payload;
    },
    setDataImageCroped: (state, action: PayloadAction<imageCrop>) => {
      state.dataImageCroped = action.payload;
    },
    updateImageDataNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        ImageData: valueImageNeswletter;
        parentId?: string | null;
      }>
    ) => {
      const { templateId, inputId, ImageData, parentId } = action.payload;

      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === templateId) {
          return {
            ...item,
            inputs: item.inputs.map((input) => {
              if (input.inputId === inputId && input.type === 'image') {
                return {
                  ...input,
                  ImageData: {
                    ...input?.ImageData,
                    ...ImageData,
                  },
                };
              }

              if (input.inputId === parentId && input.type === 'layout') {
                return {
                  ...input,
                  inputs: input.inputs.map((input2) => {
                    if (input2.inputId === inputId && input2.type === 'image') {
                      return {
                        ...input2,
                        ImageData: {
                          ...input2?.ImageData,
                          ...ImageData,
                        },
                      };
                    }
                    return input2;
                  }),
                };
              }
              return input;
            }),
          };
        }
        return item;
      });
    },

    deleteNewsletterTemplate: (state, action: PayloadAction<string>) => {
      state.currentNewsletter = state.currentNewsletter.filter(
        (item) => item.templateId !== action.payload
      );
    },

    deleteInputNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        index: number;
      }>
    ) => {
      const { templateId, index } = action.payload;

      // elimino los errores del input
      const input = state.currentNewsletter.find((item) => item.templateId === templateId)?.inputs[
        index
      ];

      if (input?.type === 'layout') {
        const inputs = input.inputs.map((item) => item.inputId);

        const newErrors = state.errors.filter(
          (item) => item.templateId !== templateId || !inputs.includes(item.inputId)
        );

        state.errors = newErrors;
      } else {
        const newErrors = state.errors.filter(
          (item) => item.templateId !== templateId || item.inputId !== input?.inputId
        );

        state.errors = newErrors;
      }

      /// si el input es el ultimo typo addInput no se puede eliminar
      const isAddInput = state.currentNewsletter.some(
        (item) => item.templateId === templateId && item.inputs[index].type === 'addInput'
      );

      if (isAddInput) return;
      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === templateId) {
          return {
            ...item,
            inputs: item.inputs.filter((_, i) => i !== index),
          };
        }
        return item;
      });
    },
    moveTemplateNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        direction: string;
      }>
    ) => {
      const { templateId, direction } = action.payload;
      const index = state.currentNewsletter.findIndex((item) => item.templateId === templateId);

      if (direction === 'up' && index !== 1) {
        const temp = state.currentNewsletter[index - 1];
        state.currentNewsletter[index - 1] = state.currentNewsletter[index];
        state.currentNewsletter[index] = temp;
      }
      if (direction === 'down' && index !== state.currentNewsletter.length - 2) {
        const temp = state.currentNewsletter[index + 1];
        state.currentNewsletter[index + 1] = state.currentNewsletter[index];
        state.currentNewsletter[index] = temp;
      }
    },
    reorderInputNewsletter: (
      state,
      action: PayloadAction<{
        templateId: string;
        currentIndex: number;
        newIndex: number;
      }>
    ) => {
      const { templateId, currentIndex, newIndex } = action.payload;
      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === templateId) {
          const inputsCopy = [...item.inputs];
          const [movedInput] = inputsCopy.splice(currentIndex, 1);
          inputsCopy.splice(newIndex, 0, movedInput);
          return {
            ...item,
            inputs: inputsCopy,
          };
        }
        return item;
      });
    },

    changeColorNewslettertemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        color: string;
      }>
    ) => {
      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === action.payload.templateId) {
          return {
            ...item,
            color: action.payload.color,
          };
        }
        return item;
      });
    },
    changeBGColorNewslettertemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        color: string;
      }>
    ) => {
      state.currentNewsletter = state.currentNewsletter.map((item) => {
        if (item.templateId === action.payload.templateId) {
          return {
            ...item,
            bgColor: action.payload.color,
          };
        }
        return item;
      });
    },
    setEmails: (state, action: PayloadAction<string[]>) => {
      state.emails = action.payload;
    },
    setDeleted: (state, action: PayloadAction<boolean>) => {
      state.deleted = action.payload;
    },
    setHeader: (state, action: PayloadAction<boolean>) => {
      state.header = action.payload;
    },
    setSubject: (state, action: PayloadAction<string>) => {
      state.subject = action.payload;
    },
    setcurrentNewsletterID: (state, action: PayloadAction<string>) => {
      state.currentNewsletterId = action.payload;
    },
    setCurrentNewsletterImagesList: (state, action: PayloadAction<any[]>) => {
      state.currentNewsletterImagesList = action.payload;
    },

    setShowAprove: (state, action: PayloadAction<boolean>) => {
      state.showAprove = action.payload;
    },

    setImagesSaved: (state, action: PayloadAction<boolean>) => {
      state.imageSaved = action.payload;
    },
    setObjectFit: (state, action: PayloadAction<any>) => {
      state.objectFit = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setShowEditor,
  setMenu,
  setSelectedNewsletter,
  updateValueInputNewsletter,
  setNeswletterList,
  setStylesNewsletter,
  setcurrentNewsletter,
  setErrors,
  setDataImageCrop,
  updateImageDataNewsletter,
  setDataImageCroped,
  addNewInputNewsletter,
  addTagNewsletter,
  deleteTagNewsletter,
  deleteNewsletterTemplate,
  moveTemplateNewsletter,
  deleteInputNewsletter,
  reorderInputNewsletter,
  changeColorNewslettertemplate,
  changeBGColorNewslettertemplate,
  setEmails,
  setDeleted,
  setHeader,
  setSubject,
  setcurrentNewsletterID,
  setCurrentNewsletterImagesList,
  setShowAprove,
  setImagesSaved,
  setObjectFit,
} = NewsletterSlice.actions;

export default NewsletterSlice.reducer;
