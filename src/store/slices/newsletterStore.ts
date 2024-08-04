// import { create } from 'zustand';
// import { DEFAULT_COLOR_NESWLETTER } from 'src/theme/palette';
// import { headerContent } from 'src/sections/create-newsletter/templates/header/header-content';
// import { FooterContent } from 'src/sections/create-newsletter/templates/footer/footer-content';
// import {
//   TypeTemplateContent,
//   TagInput,
//   valueImageNeswletter,
// } from 'src/sections/create-newsletter/inputs/types';
// import { NeswletterState, Tmenudata, imageCrop, newsletterItemList } from 'src/types/newsletter';

// interface newsletterStore {
//   menuData: Tmenudata;
//   selectedNewsletter: string;
//   neswletterList: newsletterItemList[];
//   styles: {
//     main: string;
//   };
//   currentNewsletter: TypeTemplateContent[];
//   errors: any[];
//   dataImageCrop: imageCrop | null;
//   dataImageCroped: imageCrop | null;
//   emails: string[];
//   deleted: boolean;
//   header: boolean;
//   showEditor: boolean;
//   subject: string;
//   currentNewsletterId: string;
//   currentNewsletterImagesList: valueImageNeswletter[];
//   showAprove: boolean;
//   imageSaved: boolean;
//   objectFit: string;
//   setShowEditor: (showEditor: boolean) => void;
//   setMenu: (menuData: Tmenudata) => void;
//   setSelectedNewsletter: (selectedNewsletter: string) => void;
//   setNeswletterList: (neswletterList: newsletterItemList[]) => void;
//   setStylesNewsletter: (styles: { main: string }) => void;
//   setCurrentNewsletter: (currentNewsletter: TypeTemplateContent[]) => void;
//   setErrors: (errors: any[]) => void;
//   setDataImageCrop: (dataImageCrop: imageCrop | null) => void;
//   setDataImageCroped: (dataImageCroped: imageCrop | null) => void;
//   addNewInputNewsletter: (templateId: string, input: any) => void;
//   addTagNewsletter: (templateId: string, inputId: string, inputTag: TagInput) => void;
//   deleteTagNewsletter: (templateId: string, inputId: string, tagId: string) => void;
//   updateValueInputNewsletter: (
//     templateId: string,
//     inputId: string,
//     value: string,
//     parentId: string
//   ) => void;
//   deleteNewsletterTemplate: (templateId: string) => void;
//   deleteInputNewsletter: (templateId: string, index: number) => void;
//   moveTemplateNewsletter: (templateId: string, direction: string) => void;
//   reorderInputNewsletter: (templateId: string, currentIndex: number, newIndex: number) => void;
//   changeColorNewslettertemplate: (templateId: string, color: string) => void;
//   changeBGColorNewslettertemplate: (templateId: string, color: string) => void;
//   setEmails: (emails: string[]) => void;
//   setDeleted: (deleted: boolean) => void;
//   setHeader: (header: boolean) => void;
//   setSubject: (subject: string) => void;
//   setCurrentNewsletterID: (currentNewsletterId: string) => void;
//   setCurrentNewsletterImagesList: (currentNewsletterImagesList: valueImageNeswletter[]) => void;
//   setShowAprove: (showAprove: boolean) => void;
//   setImagesSaved: (imageSaved: boolean) => void;
//   setObjectFit: (objectFit: string) => void;
// }

// const useNewsletterStore = create<newsletterStore>((set) => ({
//   menuData: { type: 'none', templateId: '', inputId: 'string', parentId: 'string' },
//   selectedNewsletter: '',
//   neswletterList: [],
//   styles: {
//     main: DEFAULT_COLOR_NESWLETTER,
//   },
//   currentNewsletter: [headerContent('header'), FooterContent('footer')],
//   currentNewsletterId: '',
//   currentNewsletterImagesList: [],
//   errors: [],
//   dataImageCrop: null,
//   dataImageCroped: null,
//   emails: [],
//   header: true,
//   showEditor: false,
//   deleted: false,
//   subject: 'ADAC',
//   showAprove: false,
//   imageSaved: true,
//   objectFit: 'cover',

//   setShowEditor: (showEditor) => set({ showEditor }),
//   setMenu: (menuData) => set({ menuData }),
//   setSelectedNewsletter: (selectedNewsletter) => set({ selectedNewsletter }),
//   setNeswletterList: (neswletterList) => set({ neswletterList }),
//   setStylesNewsletter: (styles) => set({ styles }),
//   setCurrentNewsletter: (currentNewsletter) => set({ currentNewsletter }),
//   setErrors: (errors) => set({ errors }),
//   setDataImageCrop: (dataImageCrop) => set({ dataImageCrop }),
//   setDataImageCroped: (dataImageCroped) => set({ dataImageCroped }),
//   addNewInputNewsletter: (templateId, input) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.map((item) =>
//         item.templateId === templateId
//           ? {
//               ...item,
//               inputs: [
//                 ...(item.inputs.filter((item2) => item2.type !== 'addInput') || []),
//                 { ...input },
//                 ...(item.inputs.filter((item2) => item2.type === 'addInput') || []),
//               ],
//             }
//           : item
//       ),
//     })),
//   addTagNewsletter: (templateId, inputId, inputTag) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.map((item) =>
//         item.templateId === templateId
//           ? {
//               ...item,
//               inputs: item.inputs.map((input) =>
//                 input.inputId === inputId && input.type === 'tags'
//                   ? {
//                       ...input,
//                       tags: [...input.tags, { ...inputTag }],
//                     }
//                   : input
//               ),
//             }
//           : item
//       ),
//     })),
//   deleteTagNewsletter: (templateId, inputId, tagId) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.map((item) =>
//         item.templateId === templateId
//           ? {
//               ...item,
//               inputs: item.inputs.map((input) =>
//                 input.inputId === inputId && input.type === 'tags'
//                   ? {
//                       ...input,
//                       tags: input.tags.filter((tag) => tag.inputId !== tagId),
//                     }
//                   : input
//               ),
//             }
//           : item
//       ),
//     })),
//   updateValueInputNewsletter: (templateId, inputId, value, parentId) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.map((item) => {
//         if (item.templateId === templateId) {
//           return {
//             ...item,
//             inputs: item.inputs.map((input) => {
//               if (input.type === 'tags' && input.inputId === parentId) {
//                 return {
//                   ...input,
//                   tags: input?.tags.map((tag) =>
//                     tag.inputId === inputId ? { ...tag, value } : tag
//                   ),
//                 };
//               }
//               if (input.inputId === parentId && input.type === 'layout') {
//                 return {
//                   ...input,
//                   inputs: input.inputs.map((input2) =>
//                     input2.inputId === inputId ? { ...input2, value } : input2
//                   ),
//                 };
//               }
//               if (input.inputId === inputId && input.type !== 'tags' && input.type !== 'layout') {
//                 return { ...input, value };
//               }
//               return input;
//             }),
//           };
//         }
//         return item;
//       }),
//     })),
//   deleteNewsletterTemplate: (templateId) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.filter((item) => item.templateId !== templateId),
//     })),
//   deleteInputNewsletter: (templateId, index) =>
//     set((state) => {
//       const input = state.currentNewsletter.find((item) => item.templateId === templateId)?.inputs[
//         index
//       ];
//       if (input?.type === 'layout') {
//         const inputs = input.inputs.map((item) => item.inputId);
//         const newErrors = state.errors.filter(
//           (item) => item.templateId !== templateId || !inputs.includes(item.inputId)
//         );
//         state.errors = newErrors;
//       } else {
//         const newErrors = state.errors.filter(
//           (item) => item.templateId !== templateId || item.inputId !== input?.inputId
//         );
//         state.errors = newErrors;
//       }

//       const isAddInput = state.currentNewsletter.some(
//         (item) => item.templateId === templateId && item.inputs[index].type === 'addInput'
//       );
//       if (isAddInput) return state;

//       return {
//         currentNewsletter: state.currentNewsletter.map((item) =>
//           item.templateId === templateId
//             ? { ...item, inputs: item.inputs.filter((_, i) => i !== index) }
//             : item
//         ),
//       };
//     }),
//   moveTemplateNewsletter: (templateId, direction) =>
//     set((state) => {
//       const index = state.currentNewsletter.findIndex((item) => item.templateId === templateId);
//       if (direction === 'up' && index !== 1) {
//         const temp = state.currentNewsletter[index - 1];
//         state.currentNewsletter[index - 1] = state.currentNewsletter[index];
//         state.currentNewsletter[index] = temp;
//       }
//       if (direction === 'down' && index !== state.currentNewsletter.length - 2) {
//         const temp = state.currentNewsletter[index + 1];
//         state.currentNewsletter[index + 1] = state.currentNewsletter[index];
//         state.currentNewsletter[index] = temp;
//       }
//     }),
//   reorderInputNewsletter: (templateId, currentIndex, newIndex) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.map((item) => {
//         if (item.templateId === templateId) {
//           const inputsCopy = [...item.inputs];
//           const [movedInput] = inputsCopy.splice(currentIndex, 1);
//           inputsCopy.splice(newIndex, 0, movedInput);
//           return {
//             ...item,
//             inputs: inputsCopy,
//           };
//         }
//         return item;
//       }),
//     })),
//   changeColorNewslettertemplate: (templateId, color) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.map((item) =>
//         item.templateId === templateId ? { ...item, color } : item
//       ),
//     })),
//   changeBGColorNewslettertemplate: (templateId, color) =>
//     set((state) => ({
//       currentNewsletter: state.currentNewsletter.map((item) =>
//         item.templateId === templateId ? { ...item, bgColor: color } : item
//       ),
//     })),
//   setEmails: (emails) => set({ emails }),
//   setDeleted: (deleted) => set({ deleted }),
//   setHeader: (header) => set({ header }),
//   setSubject: (subject) => set({ subject }),
//   setCurrentNewsletterID: (currentNewsletterId) => set({ currentNewsletterId }),
//   setCurrentNewsletterImagesList: (currentNewsletterImagesList) =>
//     set({ currentNewsletterImagesList }),
//   setShowAprove: (showAprove) => set({ showAprove }),
//   setImagesSaved: (imageSaved) => set({ imageSaved }),
//   setObjectFit: (objectFit) => set({ objectFit }),
// }));

// export default useNewsletterStore;
