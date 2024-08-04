'use client';

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
import {
  TagInput,
  TypeTemplateContent,
  valueImageNeswletter,
} from 'src/sections/create-newsletter/inputs/types';
import { imageCrop, Tmenudata } from 'src/types/newsletter';

export type statusNota = 'DRAFT' | 'REVIEW' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

export type NotaItemList = {
  id: string;
  creationDate: Date;
  createdAt: Date;
  title: string;
  content: string;
  status: statusNota;
  scheduleDate: Date;
  objData: string;
  approverEmails: string[];
  coverImageUrl: string;
  origin?: string;
  publishOnAdac?: boolean;
};

type INotaNames = 'Header' | 'Noticias' | 'Footer' | 'Blank';

type Notaseccions = {
  templateId: string;
  name: INotaNames;
  inputs: TypeTemplateContent[];
  color: string;
  bgColor: string;
};

type error = {
  templateId: string;
  inputId: string;
  name: INotaNames;
  type: string;
  message: string;
};

interface NotaState {
  showEditor: boolean;
  menuData: Tmenudata;
  //
  selectedNota: string;
  neswletterList: NotaItemList[];
  currentNotaId: string;
  currentNotaImagesList: any[];
  styles: {
    main: string;
  };
  currentNota: Notaseccions[];
  errors: error[];
  dataImageCrop: imageCrop | null;
  dataImageCroped: imageCrop | null;
  emails: string[];
  deleted: boolean;
  header: boolean;
  subject: string;
  showAprove: boolean;

  imageSaved: boolean;
  objectFit: any;

  coverImage: string;
  coverImageError: boolean;

  promptIa: string;
  showTrendding: boolean;

  urlngrok: string;
  selectedTab: number;

  loading: boolean;

  filters: any;
  deleteItem: boolean;
}

const initialState: NotaState = {
  menuData: { type: 'none', templateId: '', inputId: 'string', parentId: 'string' },
  //
  selectedNota: '',
  neswletterList: [],

  styles: {
    main: DEFAULT_COLOR_NESWLETTER,
  },

  currentNota: [],
  currentNotaId: '',
  currentNotaImagesList: [],
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

  coverImage: '',
  coverImageError: false,
  promptIa: '',
  showTrendding: false,
  urlngrok: '',
  selectedTab: 0,

  loading: false,
  filters: {
    creationDate: null,
    state: 'DRAFT',
    publishOnAdac: false,
  },

  deleteItem: false,
};

export const NoteSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setShowEditor: (state, action: PayloadAction<boolean>) => {
      state.showEditor = action.payload;
    },
    setMenu: (state, action: PayloadAction<Tmenudata>) => {
      state.menuData = action.payload;
    },
    setSelectedNota: (state, action: PayloadAction<string>) => {
      state.selectedNota = action.payload;
    },
    setNeswletterList: (state, action: PayloadAction<NotaItemList[]>) => {
      state.neswletterList = action.payload;
    },
    setStylesNota: (state, action: PayloadAction<any>) => {
      state.styles = action.payload;
    },
    setcurrentNota: (state, action: PayloadAction<any>) => {
      state.currentNota = action.payload;
    },
    updateValueInputNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        value: string;
        parentId?: string | null;
      }>
    ) => {
      const { templateId, inputId, value, parentId } = action.payload;

      state.currentNota = state.currentNota.map((item) => {
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
    addNewInputNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        input: TypeTemplateContent;
      }>
    ) => {
      const { templateId, input } = action.payload;
      state.currentNota = state.currentNota.map((item) => {
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
    addTagNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        inputTag: TagInput;
      }>
    ) => {
      const { templateId, inputId, inputTag } = action.payload;
      state.currentNota = state.currentNota.map((item) => {
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
    deleteTagNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        tagId: string;
      }>
    ) => {
      const { templateId, inputId, tagId } = action.payload;
      state.currentNota = state.currentNota.map((item) => {
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
    updateImageDataNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        inputId: string;
        ImageData: valueImageNeswletter;
        parentId?: string | null;
      }>
    ) => {
      const { templateId, inputId, ImageData, parentId } = action.payload;

      state.currentNota = state.currentNota.map((item) => {
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

    deleteNotaTemplate: (state, action: PayloadAction<string>) => {
      state.currentNota = state.currentNota.filter((item) => item.templateId !== action.payload);
    },

    deleteInputNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        index: number;
      }>
    ) => {
      const { templateId, index } = action.payload;

      // elimino los errores del input
      const input = state.currentNota.find((item) => item.templateId === templateId)?.inputs[index];

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
      const isAddInput = state.currentNota.some(
        (item) => item.templateId === templateId && item.inputs[index].type === 'addInput'
      );

      if (isAddInput) return;
      state.currentNota = state.currentNota.map((item) => {
        if (item.templateId === templateId) {
          return {
            ...item,
            inputs: item.inputs.filter((_, i) => i !== index),
          };
        }
        return item;
      });
    },
    moveTemplateNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        direction: string;
      }>
    ) => {
      const { templateId, direction } = action.payload;
      const index = state.currentNota.findIndex((item) => item.templateId === templateId);

      if (direction === 'up' && index !== 1) {
        const temp = state.currentNota[index - 1];
        state.currentNota[index - 1] = state.currentNota[index];
        state.currentNota[index] = temp;
      }
      if (direction === 'down' && index !== state.currentNota.length - 2) {
        const temp = state.currentNota[index + 1];
        state.currentNota[index + 1] = state.currentNota[index];
        state.currentNota[index] = temp;
      }
    },
    reorderInputNota: (
      state,
      action: PayloadAction<{
        templateId: string;
        currentIndex: number;
        newIndex: number;
      }>
    ) => {
      const { templateId, currentIndex, newIndex } = action.payload;
      state.currentNota = state.currentNota.map((item) => {
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

    changeColorNotatemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        color: string;
      }>
    ) => {
      state.currentNota = state.currentNota.map((item) => {
        if (item.templateId === action.payload.templateId) {
          return {
            ...item,
            color: action.payload.color,
          };
        }
        return item;
      });
    },
    changeBGColorNotatemplate: (
      state,
      action: PayloadAction<{
        templateId: string;
        color: string;
      }>
    ) => {
      state.currentNota = state.currentNota.map((item) => {
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
    setcurrentNotaID: (state, action: PayloadAction<string>) => {
      state.currentNotaId = action.payload;
    },
    setCurrentNotaImagesList: (state, action: PayloadAction<any[]>) => {
      state.currentNotaImagesList = action.payload;
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
    setCoverImage: (state, action: PayloadAction<string>) => {
      state.coverImage = action.payload;
    },
    setCoverImageError: (state, action: PayloadAction<boolean>) => {
      state.coverImageError = action.payload;
    },
    setpromptIa: (state, action: PayloadAction<string>) => {
      state.promptIa = action.payload;
    },
    setShowTrendding: (state, action: PayloadAction<boolean>) => {
      state.showTrendding = action.payload;
    },
    setUrlNgrok: (state, action: PayloadAction<string>) => {
      state.urlngrok = action.payload;
    },
    setselectedTab: (state, action: PayloadAction<number>) => {
      state.selectedTab = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setFilters: (state, action: PayloadAction<any>) => {
      state.filters = action.payload;
    },

    setDeleteItem: (state, action: PayloadAction<boolean>) => {
      state.deleteItem = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setShowEditor,
  setMenu,
  setSelectedNota,
  updateValueInputNota,
  setNeswletterList,
  setStylesNota,
  setcurrentNota,
  setErrors,
  setDataImageCrop,
  updateImageDataNota,
  setDataImageCroped,
  addNewInputNota,
  addTagNota,
  deleteTagNota,
  deleteNotaTemplate,
  moveTemplateNota,
  deleteInputNota,
  reorderInputNota,
  changeColorNotatemplate,
  changeBGColorNotatemplate,
  setEmails,
  setDeleted,
  setHeader,
  setSubject,
  setcurrentNotaID,
  setCurrentNotaImagesList,
  setShowAprove,
  setImagesSaved,
  setObjectFit,
  setCoverImage,
  setCoverImageError,
  setpromptIa,
  setUrlNgrok,
  setShowTrendding,
  setselectedTab,
  setLoading,
  setFilters,
  setDeleteItem,
} = NoteSlice.actions;

export default NoteSlice.reducer;