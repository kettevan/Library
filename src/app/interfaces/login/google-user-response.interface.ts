export interface UserResponseInterface {
  authorities: [string];
  fullName: string;
  email: string;
  phoneNumber?: string;
  identityNumber?: string;
  readerType?: READER_TYPES;
  accessToken: string;
  tokenType: string;
}

export enum READER_TYPES {
  student,
  lecturer,
  other
}
