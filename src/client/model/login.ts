/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

import { CookieJar } from 'tough-cookie';

export interface ILoginResponse {
    title?: string;
    message?: string;
    continueUrl?: string;
    status: number;
}

export interface ILoginForm {
    email: string;
    password: string;
    keepLogin?: boolean;
}

export interface ILoginResult {
    response: ILoginResponse;
    cookieJar: CookieJar
}
