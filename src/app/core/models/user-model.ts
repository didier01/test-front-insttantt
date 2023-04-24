export type UserModel = {
  id?: string;
  documentType?: string;
  documentNumber?: number;
  firstname?: string;
  lastname?: string;
  birthdate?: Date;
  expeditionDate?: Date;
  phoneNumber?: number;
  password?: any;
  email?: string;

  address?: string,
  city?: string,
  country?: string,
  photoProfile?: string,

};
