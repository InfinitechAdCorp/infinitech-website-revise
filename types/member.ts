export interface TelegramContact {
  title: string;
  href: string;
}

export interface ViberContact {
  title: string;
  href: string;
}

export interface Member {
  id: number;
  name: string;
  position: string;
  image: string;
  email: string;
  phone: string;
  facebookname?: string;
  facebooknames?: string;
  href?: string;
  hrefs?: string;
  company?: string;
  telegram?: TelegramContact;
  viber?: ViberContact;
  order: number;
  is_active: boolean;
}

export interface MembersResponse {
  success: boolean;
  data: Member[];
  message?: string;
}

export interface MemberResponse {
  success: boolean;
  data: Member;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  error?: string;
}