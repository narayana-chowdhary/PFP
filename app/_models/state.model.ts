import { ICity } from '../_models/index';

/* Defines the State entity */
export interface IState {
    id: number;
    name: string;
    code: string;
    cities?: ICity[];
}