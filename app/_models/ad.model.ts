// Ad Model interface and Category and AtType Enums

export enum CategoryEnum {
    Plant = 1,
    Accessories = 2
}
export enum AdTypeEnum {
    'Offering Ad' = 1,
    'Wanted Ad' = 2
}

/* Defines the Ad entity */
export interface IAd {
    id: number;
    itemCategory: CategoryEnum;//Plant or Plant Accessories
    adType: AdTypeEnum;//Offering Ads/Wanted Ads
    //I have a plant which needs to be adopted
    //I want to adopt a plant
    adTitle: string;//2 years Orchid plant up for Adoption in Koramangala
    specialCharactistics: string;//for example, red fragrant flowers or beautiful fall color
    easeOfAccess: string;//for example, easy access in parking strip, or in back yard up five steps and through a gate
    description: string;//anything else that might be of interest to a potential new owner
    imageUrls: string[];
    //default user location which can be changed
    locality: string;
    cityId: number;
    cityName?: string;
    stateId: number;
    stateName?: string;

    postedByName: string; //user profile name
    contactEmail: string; //default user email which can be changed
    contactPhone: string; //default user phone which can be changed
    maintainPrivacy: boolean;
    //Maintain my Privacy (Buyers will first contact you via Chat, you can decide when to reveal your phone number to them)

    isActive: boolean;

    createUserId: number;
    createDate: string;
    modifyDate?: string;
}