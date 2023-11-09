/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

import { CookieJar } from 'tough-cookie';
import { TwoFactorMethod } from './two-factor';

export interface ILoginResponse {
    title?: string;
    message?: string;
    continueUrl?: string;
    method?: TwoFactorMethod;
    maskedPhoneNumber?: string;
    maskedEmail?: string;
    disabledMethods?: TwoFactorMethod[];
    disableMethodMessages?: unknown;
    status: number;
}

export interface ILoginForm {
    email: string;
    password: string;
    keepLogin?: boolean;
}

export interface ILoginResult {
    response: ILoginResponse;
    cookieJar: CookieJar;
}

export enum LoginStatus {
    SUCCESS = 0,
    BLOCKED = -435,
    INCORRECT_PASSCODE = -444,
    INVALID_ENCRYPTION = -484,
    TWO_FACTOR = -451,
    INCORRECT_FORM = -450,
    CAPTCHA = -481,
}
