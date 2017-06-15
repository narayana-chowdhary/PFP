import { IAddress } from '../_models/index';

/* Defines the User entity */
export interface IUser {
    id: number;
    userName: string;
    password: string;
    isAdmin: boolean;
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
    emailNotification: boolean;
    mobileNotification: boolean;
    sendEvents: boolean;
    rating: number;
    addresses?: IAddress[];
    isActive: boolean;
    createDate: string;
    modifyDate: string;
}

