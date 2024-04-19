/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

import axios, { AxiosInstance } from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import CryptoJS from 'crypto-js';

import { AllConfig, DefaultConfig } from '../config';
import {
    ILoginInfoResponse,
    ILoginResponse,
    ILoginResult,
    LoginStatus,
    TwoFactorMethod,
    ITwoFactorSendRequest,
    ITwoFactorSendResponse,
    ITwoFactorVerifyForm,
    ITwoFactorVerifyRequest,
} from './model';
import {
    ITiaraConfig,
    TiaraFactory,
} from '../tiara';

export interface ILoginForm {
    email: string;
    password: string;
    keepLogin?: boolean;
}

export class AuthApiClient {
    private config: AllConfig;
    private client: AxiosInstance;
    private cookieJar: CookieJar;
    private referer: string;
    private csrf: string;

    private constructor(config: AllConfig) {
        this.config = config;
        this.cookieJar = new CookieJar();
        this.client = wrapper(axios.create({
            jar: this.cookieJar,
            baseURL: 'https://accounts.kakao.com',
            headers: {
                'User-Agent': this.config.userAgent,
                'Upgrade-Insecure-Requests': '1',
            },
            paramsSerializer: (params) => new URLSearchParams(params).toString(),
        }));

        this.client.interceptors.request.use((config) => {
            config.headers['Referer'] ??= this.referer;

            return config;
        });

        this.client.interceptors.response.use((response) => {
            if (typeof response.headers.hasContentType === 'function' && response.headers.hasContentType('text/html')) {
                this.referer = response.request.res.responseUrl;
            }

            if (response.status !== 200) throw new Error('unknown error with status code ' + response.status);

            return response;
        });
    }

    public static create(config: Partial<AllConfig> = DefaultConfig) {
        return new AuthApiClient({
            ...DefaultConfig,
            ...config,
        });
    }

    public async sendTwoFactor(method: TwoFactorMethod) {
        if (!this.csrf) throw new Error('Failed to get csrf\nPlease call login first');

        let url = '';
        let data: ITwoFactorSendRequest = {
            _csrf: this.csrf,
        };

        switch (method) {
        case 'tms':
            url = '/api/v2/two_step_verification/send_tms_for_login.json';
            break;
        case 'email':
            url = '/api/v2/two_step_verification/send_passcode_for_login.json';
            data = {
                ...data,
                reissue: false,
                verifyMethod: 'email',
            };
            break;
        default:
            throw new Error('Unknown two factor method');
        }

        const res = await this.client.post<
            ITwoFactorSendResponse
        >(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        await this.getTiara({
            referer: this.referer,
            section: 'twoStepVerification',
            page: `two-step-verification-${method}-login`,
        });

        return res.data;
    }

    public async verifyTwoFactor(method: TwoFactorMethod, form: ITwoFactorVerifyForm): Promise<ILoginResult> {
        if (!this.csrf) throw new Error('Failed to get csrf\nPlease call login first');
        if (!form.token) throw new Error('Token is required');
        if (method === 'email' && !form.passcode) throw new Error('Passcode is required');

        let url = '';
        let data: ITwoFactorVerifyRequest = {
            _csrf: this.csrf,
            isRememberBrowser: true,
            token: form.token,
        };

        switch (method) {
        case 'tms':
            url = '/api/v2/two_step_verification/verify_tms_for_login.json';
            break;
        case 'email':
            url = '/api/v2/two_step_verification/verify_passcode_for_login.json';
            data = {
                ...data,
                passcode: form.passcode,
                verifyMethod: 'email',
            };
            break;
        }

        const res = await this.client.post<
            ILoginResponse
        >(
            url,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return this.handleLoginResponse(res.data);
    }

    public async login(form: ILoginForm): Promise<ILoginResult> {
        const loginInfo = await this.getLoginInfo();
        const context = loginInfo?.props?.pageProps?.pageContext?.commonContext;

        if (!context) throw new Error('Failed to get login context');

        this.csrf = context._csrf;

        await this.getTiara({
            referer: this.referer,
            section: 'login',
            page: 'page-login',
        });

        const res = await this.client.post<
            ILoginResponse
        >(
            '/api/v2/login/authenticate.json',
            {
                k: true,
                _csrf: this.csrf,
                activeSso: true,
                loginId: form.email,
                loginKey: form.email,
                loginUrl: this.referer,
                password: CryptoJS.AES.encrypt(form.password, context.p).toString(),
                staySignedIn: form.keepLogin ?? true,
                saveSignedIn: false,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        );

        return this.handleLoginResponse(res.data);
    }

    private handleLoginResponse(res: ILoginResponse) {
        switch (res.status) {
        case LoginStatus.TWO_FACTOR:
        case LoginStatus.SUCCESS:
            return {
                response: res,
                cookieJar: this.cookieJar,
            };
        case LoginStatus.BLOCKED:
            throw new Error('The country you are trying to access is blocked');
        case LoginStatus.INVALID_ENCRYPTION:
            throw new Error('Invalid encryption');
        case LoginStatus.INCORRECT_PASSCODE:
            throw new Error('Incorrect passcode');
        case LoginStatus.INCORRECT_FORM:
            throw new Error('Incorrect email or password');
        case LoginStatus.CAPTCHA:
            throw new Error('Captcha Detected');
        default:
            throw new Error('unknown error with status code ' + res.status);
        }
    }

    public async logout() {
        await this.client.get(
            '/logout',
            {
                params: {
                    continue: this.config.serviceURL,
                },
                headers: {
                    'Referer': this.config.serviceURL,
                },
            },
        );
    }

    public async getTiara(config: ITiaraConfig) {
        const res = await this.client.get(
            'https://stat.tiara.kakao.com/track',
            {
                params: {
                    d: JSON.stringify(TiaraFactory.generateTiara(config)),
                },
            },
        );

        return res.headers['set-cookie'];
    }

    public async getLoginInfo(): Promise<ILoginInfoResponse> {
        const res = await this.client.get<
            string
        >(
            '/login',
            {
                params: {
                    app_type: 'web',
                    continue: this.config.serviceURL,
                },
                headers: {
                    'Referer': this.config.serviceURL,
                },
                responseType: 'document',
            },
        );

        const data = /({.*})/.exec(res.data)[0];
        return JSON.parse(data);
    }
}
