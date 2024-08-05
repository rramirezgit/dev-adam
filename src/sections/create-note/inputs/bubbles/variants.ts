export type textVariantsNotas =
  | "title"
  | "subtitle"
  | "paragraph"
  | "seccion"
  | "tags";

export const TEXT_BUBLE_VARIANT: {
  [key in textVariantsNotas]: textVariantsNotas;
} = {
  title: "title",
  subtitle: "subtitle",
  paragraph: "paragraph",
  seccion: "seccion",
  tags: "tags",
};
