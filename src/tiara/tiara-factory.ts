/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

import { ITrackObject } from './index';

export interface ITiaraConfig {
    referer: string;
    section: string;
    page: string;
}

export namespace TiaraFactory {
    export const seed = [
        '0', '1', '2', '3', '4', '5',
        '6', '7', '8', '9', 'a', 'b',
        'c', 'd', 'e', 'f', 'g', 'h',
        'i', 'j', 'k', 'l', 'm', 'n',
        'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z',
        'A', 'B', 'C', 'D', 'E', 'F',
        'G', 'H', 'I', 'J', 'K', 'L',
        'M', 'N', 'O', 'P', 'Q', 'R',
        'S', 'T', 'U', 'V', 'W', 'X',
        'Y', 'Z',
    ];

    export function generateTiara(config: ITiaraConfig): ITrackObject {
        const tuid = generateRandomUUIDWithDateTime();
        const uuid = generateRandomUUIDWithDateNumber();
        const isuid = generateRandomUUIDWithDateNumber();

        return {
            sdk: {
                type: 'WEB',
                version: '1.1.28',
            },
            env: {
                screen: '1920x1080',
                tz: '+9',
                cke: 'Y',
            },
            common: {
                svcdomain: 'accounts.kakao.com',
                deployment: 'production',
                url: 'https://accounts.kakao.com/login/',
                section: config.section,
                page: config.page,
            },
            etc: {
                client_info: {
                    tuid,
                    tsid: tuid,
                    uuid,
                    suid: uuid,
                    isuid,
                    client_timestamp: Date.now(),
                },
            },
            action: {
                type: 'Pageview',
                name: config.page,
                kind: '',
            },
        };
    }

    export function generateRandomUUIDWithDateTime() {
        return `w-${shortenID(12)}_${currentTimeStamp()}`;
    }

    export function generateRandomUUIDWithDateNumber() {
        return `w-${shortenID(12)}_${currentTimeStamp().substring(0, 6)}${randomNumericString(9)}`;
    }

    export function currentTimeStamp() {
        const date = new Date();
        date.setHours(date.getHours() + 9);
        return date.toISOString().replace(/T|Z|-|:|\./g, '').substring(2);
    }

    export function randomNumericString(length: number) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10).toString();
        }
        return result;
    }

    export function shortenID(length: number) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += seed[Math.floor(Math.random() * seed.length)];
        }
        return result;
    }
}
