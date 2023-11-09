/*
 * Created on Thu Nov 09 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

export type TwoFactorMethod = 'tms' | 'email';

export interface ITwoFactorSendRequest {
    _csrf: string;
    reissue?: boolean;
    verifyMethod?: string;
}

export interface ITwoFactorSendResponse {
    token: string;
    expireSeconds: number;
    status: number;
}

export interface ITwoFactorVerifyRequest {
    _csrf: string;
    token: string;
    isRememberBrowser: boolean;
    passcode?: string;
    verifyMethod?: string;
}

export interface ITwoFactorVerifyForm {
    token: string;
    passcode?: string;
}

