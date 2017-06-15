
/* Defines the Address entity */
export interface IAddress {
    id?: number;
    locality?: string;
    cityId: number;
    cityName?: string;
    stateId: number;
    stateName?: string;
    zip?: string;
    userId?: number;
}