export type textVariantsNewsletters = 'title' | 'subtitle' | 'paragraph' | 'seccion' | 'tags';

export const TEXT_BUBLE_VARIANT: { [key in textVariantsNewsletters]: textVariantsNewsletters } = {
  title: 'title',
  subtitle: 'subtitle',
  paragraph: 'paragraph',
  seccion: 'seccion',
  tags: 'tags',
};
