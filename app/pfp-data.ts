import { InMemoryDbService } from 'angular-in-memory-web-api';

import { IUser, IAd, IState, ICity } from './_models/index';

export class PFPData implements InMemoryDbService {

    createDb() {
        let users: IUser[] = [
            {
                'id': 1,
                'userName': 'system',
                'password': 'admin',
                'isAdmin': true,
                'firstName': 'system',
                'lastName': 'admin',
                'email': 'systemadmin@gmail.com',
                'mobile': null,
                'emailNotification': true,
                'mobileNotification': true,
                'rating': 5,
                'sendEvents': true,
                'addresses': [],
                'isActive': true,
                'createDate': 'March 19, 2017',
                'modifyDate': null
            },
            {
                'id': 2,
                'userName': 'Ravi',
                'password': 'ravi',
                'isAdmin': false,
                'firstName': null,
                'lastName': null,
                'email': null,
                'mobile': null,
                'emailNotification': false,
                'mobileNotification': false,
                'rating': 4,
                'sendEvents': true,
                'addresses': null,
                'isActive': true,
                'createDate': 'March 19, 2017',
                'modifyDate': null
            },
            {
                'id': 4,
                'userName': 'Narayana',
                'password': 'tavant',
                'isAdmin': false,
                'firstName': 'Narayana',
                'lastName': 'Chowdhary',
                'email': 'narayana@gmail.com',
                'mobile': '9988771122',
                'emailNotification': true,
                'mobileNotification': true,
                'rating': 3,
                'sendEvents': true,
                'addresses': [
                    {
                        'id': 1,
                        'locality': 'Marathahalli',
                        'cityId': 4,
                        'cityName': 'Bangalore',
                        'stateId': 2,
                        'stateName': 'Karnataka',
                        'zip': '556677'
                    },
                    {
                        'id': 2,
                        'locality': 'Koramangala',
                        'cityId': 4,
                        'cityName': 'Bangalore',
                        'stateId': 2,
                        'stateName': 'Karnataka',
                        'zip': '560095'
                    }
                ],
                'isActive': true,
                'createDate': 'March 22, 2017',
                'modifyDate': null
            },
            {
                'id': 5,
                'userName': 'Test',
                'password': 'test',
                'isAdmin': false,
                'firstName': null,
                'lastName': null,
                'email': null,
                'mobile': null,
                'emailNotification': false,
                'mobileNotification': false,
                'rating': 2,
                'sendEvents': false,
                'addresses': null,
                'isActive': false,
                'createDate': 'March 19, 2017',
                'modifyDate': null
            }
        ];

        let ads: IAd[] = [
            {
                'id': 1,
                'itemCategory': 1,
                'adType': 1,
                'adTitle': '2 years Orchid plant up for Adoption in Koramangala',
                'specialCharactistics': 'red fragrant flowers',
                'easeOfAccess': 'easy access in parking strip',
                'description': 'anything else that might be of interest to a potential new owner',
                'imageUrls': ['/app/assets/images/save-plants.png', '/app/assets/images/adopt-a-plant.jpg'],
                'postedByName': 'Lakshmi',
                'contactEmail': 'narayana@gmail.com',
                'contactPhone': '9988776655',
                'maintainPrivacy': true,
                'locality': 'K R Market',
                'cityId': 4,
                'cityName': 'Bangalore',
                'stateId': 2,
                'stateName': 'Karnataka',
                'isActive': true,
                'createDate': 'March 20, 2017',
                'createUserId': 4
            },
            {
                'id': 2,
                'itemCategory': 1,
                'adType': 1,
                'adTitle': 'Rose plant in Marathahalli',
                'specialCharactistics': 'beautiful fall color',
                'easeOfAccess': 'easy access in parking strip',
                'description': 'anything else that might be of interest to a potential new owner',
                'imageUrls': ['/app/assets/images/adopt-a-plant.jpg', '/app/assets/images/save-plants.png'],
                'postedByName': 'Lakshmi',
                'contactEmail': 'narayana@gmail.com',
                'contactPhone': '9988776655',
                'maintainPrivacy': true,
                'locality': 'K R Puram',
                'cityId': 4,
                'cityName': 'Bangalore',
                'stateId': 2,
                'stateName': 'Karnataka',
                'isActive': true,
                'createDate': 'March 19, 2017',
                'createUserId': 4
            },
            {
                'id': 3,
                'itemCategory': 1,
                'adType': 1,
                'adTitle': 'Lotus plant',
                'specialCharactistics': 'yellow fragrant flowers',
                'easeOfAccess': 'easy access in parking strip',
                'description': 'anything else that might be of interest to a potential new owner',
                'imageUrls': ['/app/assets/images/save-plants.png'],
                'postedByName': 'Lakshmi',
                'contactEmail': 'narayana@gmail.com',
                'contactPhone': '9988776655',
                'maintainPrivacy': true,
                'locality': 'Domlur',
                'cityId': 4,
                'cityName': 'Bangalore',
                'stateId': 2,
                'stateName': 'Karnataka',
                'isActive': true,
                'createDate': 'May 10, 2017',
                'createUserId': 4
            },
            {
                'id': 4,
                'itemCategory': 1,
                'adType': 1,
                'adTitle': 'Orchid plant up for Adoption in Koramangala',
                'specialCharactistics': 'red fragrant flowers',
                'easeOfAccess': 'easy access in parking strip',
                'description': 'anything else that might be of interest to a potential new owner',
                'imageUrls': ['/app/assets/images/bg-image.jpg'],
                'postedByName': 'Ravi test',
                'contactEmail': 'ravitest@gmail.com',
                'contactPhone': '9988779955',
                'maintainPrivacy': true,
                'locality': 'Marathahalli',
                'cityId': 4,
                'cityName': 'Bangalore',
                'stateId': 2,
                'stateName': 'Karnataka',
                'isActive': true,
                'createDate': 'May 19, 2017',
                'createUserId': 2
            },
            {
                'id': 5,
                'itemCategory': 1,
                'adType': 1,
                'adTitle': 'Rose plant in Marathahalli',
                'specialCharactistics': 'beautiful fall color',
                'easeOfAccess': 'easy access in parking strip',
                'description': 'anything else that might be of interest to a potential new owner',
                'imageUrls': ['/app/assets/images/save-plants.png'],
                'postedByName': 'Ravi test',
                'contactEmail': 'ravitest@gmail.com',
                'contactPhone': '9988779955',
                'maintainPrivacy': true,
                'locality': 'Koramangala',
                'cityId': 4,
                'cityName': 'Bangalore',
                'stateId': 2,
                'stateName': 'Karnataka',
                'isActive': true,
                'createDate': 'April 11, 2017',
                'createUserId': 2
            },
            {
                'id': 6,
                'itemCategory': 1,
                'adType': 1,
                'adTitle': 'Lotus plant',
                'specialCharactistics': 'yellow fragrant flowers',
                'easeOfAccess': 'easy access in parking strip',
                'description': 'anything else that might be of interest to a potential new owner',
                'imageUrls': ['/app/assets/images/save-plants.png'],
                'postedByName': 'Ravi test',
                'contactEmail': 'ravitest@gmail.com',
                'contactPhone': '9988779955',
                'maintainPrivacy': true,
                'locality': 'Marathahalli',
                'cityId': 4,
                'cityName': 'Bangalore',
                'stateId': 2,
                'stateName': 'Karnataka',
                'isActive': true,
                'createDate': 'April 10, 2017',
                'createUserId': 2
            },
            {
                'id': 7,
                'itemCategory': 2,
                'adType': 1,
                'adTitle': 'Water lily pot',
                'specialCharactistics': 'Made of Fiber',
                'easeOfAccess': 'easy access in parking strip',
                'description': 'It is in mint condition',
                'imageUrls': ['/app/assets/images/save-plants.png'],
                'postedByName': 'Ravi',
                'contactEmail': 'ravitest@gmail.com',
                'contactPhone': '9988779955',
                'maintainPrivacy': true,
                'locality': 'Koramangala',
                'cityId': 4,
                'cityName': 'Bangalore',
                'stateId': 2,
                'stateName': 'Karnataka',
                'isActive': true,
                'createDate': 'February 1, 2017',
                'createUserId': 2
            },
            {
                'id': 8,
                'itemCategory': 1,
                'adType': 2,
                'adTitle': 'Cactus plant',
                'specialCharactistics': 'grafted',
                'easeOfAccess': '',
                'description': '',
                'imageUrls': ['/app/assets/images/save-plants.png'],
                'postedByName': 'Ravi',
                'contactEmail': 'ravitest@gmail.com',
                'contactPhone': '9988779955',
                'maintainPrivacy': false,
                'locality': 'S R Nagar',
                'cityId': 2,
                'cityName': 'Kadapa',
                'stateId': 1,
                'stateName': 'Andhra Pradesh',
                'isActive': true,
                'createDate': 'February 13, 2017',
                'createUserId': 2
            }
        ];

        let states: IState[] = [
            {
                id: 1,
                name: 'Andhra Pradesh',
                code: 'AP'
            },
            {
                id: 2,
                name: 'Karnataka',
                code: 'KA'
            },
        ];

        let cities: ICity[] = [
            {
                id: 1,
                name: 'Vijayawada',
                stateId: 1
            },
            {
                id: 2,
                name: 'Kadapa',
                stateId: 1
            },
            {
                id: 3,
                name: 'Tirupati',
                stateId: 1
            },
            {
                id: 4,
                name: 'Bangalore',
                stateId: 2
            },
            {
                id: 5,
                name: 'Bellary',
                stateId: 2
            },
            {
                id: 6,
                name: 'Mysore',
                stateId: 2
            },

        ];

        return { users, ads, states, cities };
        // return { users, ads };
    }
}

