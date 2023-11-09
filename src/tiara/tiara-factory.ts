/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

export interface ITiaraConfig {
    referer: string;
    section: string;
    page: string;
}

export class TiaraFactory {
    // eslint-disable-next-line max-len
    private static seed = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    private constructor() {}

    public static generateTiara(config: ITiaraConfig) {
        const tuid = this.generateRandomUUIDWithDateTime();
        const uuid = this.generateRandomUUIDWithDateNumber();
        const isuid = this.generateRandomUUIDWithDateNumber();

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
                referrer: config.referer,
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

    public static generateRandomUUIDWithDateTime() {
        return `w-${this.shortenID(12)}_${this.currentTimeStamp()}`;
    }

    public static generateRandomUUIDWithDateNumber() {
        return `w-${this.shortenID(12)}_${this.currentTimeStamp().substring(0, 6)}${this.randomNumericString(9)}`;
    }

    public static currentTimeStamp() {
        const date = new Date();
        date.setHours(date.getHours() + 9);
        return date.toISOString().replace(/T|Z|-|:|\./g, '').substring(2);
    }

    public static randomNumericString(length: number) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 10).toString();
        }
        return result;
    }

    public static shortenID(length: number) {
        let result = '';
        for (let i = 0; i < length; i++) {
            result += this.seed[Math.floor(Math.random() * this.seed.length)];
        }
        return result;
    }
}
