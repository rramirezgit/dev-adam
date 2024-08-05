export type NotaFilterValue = string | string[] | Date | null;

export interface INotaItem {
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

export type INotasFilters = {
  creationDate: any;
  state: string;
  origin?: string;
  publishOnAdac?: boolean;
};

// export type INotaNames = 'Header' | 'Noticias' | 'Markets' | 'Publicity' | 'Quotes';
export type INotaNames = 'Header' | 'Noticias' | 'Footer' | 'Blank';

export type INewsletter = {
  name: INotaNames;
  [key: string]: any;
};
