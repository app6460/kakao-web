/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

export const DefaultConfig: IRequestConfig & ILoginConfig = {
    // eslint-disable-next-line max-len
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    serviceURL: 'https://accounts.kakao.com/weblogin/account/info',
};

export interface IRequestConfig {
    userAgent: string
}

export interface ILoginConfig {
    serviceURL: string
}

export type AllConfig = IRequestConfig & ILoginConfig;
