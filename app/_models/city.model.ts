import { IState } from '../_models/index';

/* Defines the City entity */
export interface ICity {
    id: number;
    name: string;
    stateId: number;
    state?: IState;
}