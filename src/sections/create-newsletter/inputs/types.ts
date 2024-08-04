import { textVariantsNewsletters } from 'src/sections/create-newsletter/inputs/bubbles/variants';

export type IinputsTypes =
  | 'text'
  | 'image'
  | 'tags'
  | 'readingTime'
  | 'socialMedias'
  | 'divisor'
  | 'addInput'
  | 'layout';

export const INPUTS_TYPES_NEWSLETTER: { [key in IinputsTypes]: IinputsTypes } = {
  text: 'text',
  image: 'image',
  tags: 'tags',
  readingTime: 'readingTime',
  socialMedias: 'socialMedias',
  divisor: 'divisor',
  addInput: 'addInput',
  layout: 'layout',
};

/// variants
type TextVariant = textVariantsNewsletters;
export type ImageVariant = 'HorizontalImage' | 'ImageQuartet' | 'ImageLogoSponsor' | 'Img';
type TagsVariant = 'tags';
type ReadingTimeVariant = 'readingTime';
type SocialMediasVariant = 'socialMedias';
type DivisorVariant = 'divisor';
type AddInputVariant = 'addInput';
type LayoutVariant = 'ImageText' | 'TwoImg';

/// inputs
export interface BaseInput {
  type: IinputsTypes;
  variant: TextVariant | ImageVariant | TagsVariant;
  isEmail?: boolean;
  value: string;
  IdLayout?: string;
}

export interface TextInput extends BaseInput {
  type: 'text';
  variant: TextVariant;
  disabled?: boolean;
  placeholder?: string;
  name: string;
  inputId: string;
  templateId: string;
  style?: React.CSSProperties;
  maxLength?: number;
  minLength?: number;
  errorName: string;
  parentId?: string;
}

export type valueImageNeswletter = {
  url?: string;
  bgColor?: string;
  adjustImageCrop?: boolean;
  scale?: number;
  rotate?: number;
  name?: string;
  type?: string;
};

export interface ImageInput extends BaseInput {
  type: 'image';
  outside?: boolean;
  disabled?: boolean;
  variant: ImageVariant;
  inputId: string;
  templateId: string;
  ImageData: valueImageNeswletter;
  placeholder?: string;
  style?: React.CSSProperties;
  parentId?: string;
  className?: string;
}

export interface TagInput {
  type: 'tags';
  parentId?: string;
  variant: TextVariant;
  readingTime?: {
    inputId: string;
  };
  placeholder: string;
  name: string;
  inputId: string;
  templateId: string;
  style?: React.CSSProperties;
  maxLength?: number;
  minLength?: number;
  errorName?: string;
  value: string;
}

export interface TagsInput extends BaseInput {
  type: 'tags';
  variant: TagsVariant;
  name: string;
  inputId: string;
  templateId: string;
  style?: React.CSSProperties;
  errorName?: string;
  tags: TagInput[] | [];
}

interface IAddInput {
  type: 'addInput';
  variant?: AddInputVariant;
  templateId: string;
  inputId: string;
}

// no inputs

interface IReadingTime {
  variant?: ReadingTimeVariant;
  templateId: string;
  inputId: string;
  inputIdtext: string;
  type: 'readingTime';
}

interface ISocialMedias {
  variant?: SocialMediasVariant;
  templateId: string;
  inputId: string;
  type: 'socialMedias';
}

interface IDivisor {
  variant?: DivisorVariant;
  templateId: string;
  inputId: string;
  type: 'divisor';
}

export interface ILayout {
  type: 'layout';
  templateId: string;
  inputId: string;
  inputs: any[];
  variant?: LayoutVariant;
}

export type TypeTemplateContent =
  | TextInput
  | ImageInput
  | TagsInput
  | IReadingTime
  | ISocialMedias
  | IDivisor
  | IAddInput
  | ILayout;
