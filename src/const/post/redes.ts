import { ISocialNetworksNames, ISocialnetworks } from 'src/types/post';

export const SOCIALNETWORKSNAMES: { [key in ISocialNetworksNames]: ISocialNetworksNames } = {
  facebook: 'facebook',
  twitter: 'twitter',
  instagram: 'instagram',
  linkedin: 'linkedin',
  tiktok: 'tiktok',
};

export const SOCIALNETWORKS: ISocialnetworks[] = [
  {
    name: SOCIALNETWORKSNAMES.facebook,
    color: '#CDEBFF',
  },
  {
    name: SOCIALNETWORKSNAMES.twitter,
    color: '#EDEDED',
  },
  {
    name: SOCIALNETWORKSNAMES.instagram,
    color: '#FFF2FE',
  },
  {
    name: SOCIALNETWORKSNAMES.linkedin,
    color: '#E4F1FF',
  },
  {
    name: SOCIALNETWORKSNAMES.tiktok,
    color: '#E5FFFE',
  },
];
