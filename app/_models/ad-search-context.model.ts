import { CategoryEnum, AdTypeEnum } from '../_models/index';

/* Defines the AdSearchContext entity */
export interface IAdSearchContext {

    selectedCategoryId: CategoryEnum;
    selectedAdTypeId: AdTypeEnum;
    selectedStateId: number;
    selectedCityId: number;
    selectedLocality: string;
    selectedTitle: string;
    selectedPageSize?: number;
    selectedSortBy?: string;
    selectedPage?: number;
    selectedListView?: boolean;

}