import { TypeTemplateContent } from 'src/sections/create-newsletter/inputs/types';

export type NewslettersFilterValue = string | string[] | Date | null | undefined;

export interface INewslettersItem {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  platforms: string[];
  mediaUrls: string[];
  taggedProfiles: string[];
  scheduleDate: Date;
  creationDate: Date;
  hashtags: string[];
  status: string;
  publish: boolean;
  likes: null;
  shares: null;
  comments: null;
  userId: string;
  ayrshareId: string;
}

export type INewslettersFilters = {
  creationDate: Date | null;
  state: string;
};

// export type INewslettersNames = 'Header' | 'Noticias' | 'Markets' | 'Publicity' | 'Quotes';
export type INewslettersNames = 'Header' | 'Noticias' | 'Footer' | 'Blank';

export type INewsletter = {
  name: INewslettersNames;
  [key: string]: any;
};

export type newsletterseccions = {
  templateId: string;
  name: INewslettersNames;
  inputs: TypeTemplateContent[];
  color: string;
  bgColor: string;
  NotaId?: string;
};

export type TDrawers = 'add-template' | 'crop-image' | 'none';

export type Tmenudata = {
  type: TDrawers;
  templateId?: string;
  inputId?: string;
  parentId?: string;
};

export type imageCrop = {
  imageData: string;
  name: string;
  type: string;
};

export type statusNewsletter =
  | 'DRAFT'
  | 'SENDED'
  | 'DELETED'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SCHEDULED';

export type newsletterItemList = {
  id: string;
  creationDate: Date;
  subject: string;
  content: string;
  status: statusNewsletter;
  scheduleDate: Date;
  objData: string;
  approverEmails: string[];
};

type error = {
  templateId: string;
  inputId: string;
  name: INewslettersNames;
  type: string;
  message: string;
};

export interface NeswletterState {
  showEditor: boolean;
  menuData: Tmenudata;
  //
  selectedNewsletter: string;
  neswletterList: newsletterItemList[];
  currentNewsletterId: string;
  currentNewsletterImagesList: any[];
  styles: {
    main: string;
  };
  currentNewsletter: newsletterseccions[];
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
}
