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
import { ILoginInfoResponse, ILoginForm, ILoginResponse, ILoginResult } from './model';
import { TiaraFactory } from '../tiara';

export class AuthApiClient {
    private config: AllConfig;
    private client: AxiosInstance;
    private cookieJar: CookieJar;
    private referer: string;

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

            return response;
        });
    }

    public static create(config: Partial<AllConfig> = DefaultConfig): AuthApiClient {
        return new AuthApiClient({
            ...DefaultConfig,
            ...config,
        });
    }

    public async login(form: ILoginForm): Promise<ILoginResult> {
        const loginInfo = await this.getLoginInfo();
        const context = loginInfo?.props?.pageProps?.pageContext?.commonContext;

        if (!context) throw new Error('Failed to get login context');

        await this.getTiara();

        const res = await this.client.post<
            ILoginResponse
        >(
            '/api/v2/login/authenticate.json',
            {
                k: true,
                _csrf: context._csrf,
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

        return {
            response: res.data,
            cookieJar: this.cookieJar,
        };
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

    public async getTiara() {
        const res = await this.client.get(
            'https://stat.tiara.kakao.com/track',
            {
                params: {
                    d: JSON.stringify(TiaraFactory.generateTiara(this.referer)),
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
