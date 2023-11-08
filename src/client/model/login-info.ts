/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

export interface ILoginInfoResponse {
    props: IProps
    page: string
    query: IQuery
    buildId: string
    assetPrefix: string
    nextExport: boolean
    isFallback: boolean
    gip: boolean
    scriptLoader: unknown[]
}

export interface IProps {
    pageProps: IPageProps
}

export interface IPageProps {
    pageContext: IPageContext
}

export interface IPageContext {
    commonContext: ICommonContext
    context: IContext
}

export interface ICommonContext {
    locale: string
    uaClass: string
    responsiveView: boolean
    responsivePopup: boolean
    mobile: boolean
    webview: IWebview
    supportRefererMetaTag: boolean
    showHeader: boolean
    showFooter: boolean
    linkParams: ILinkParams
    showDarkMode: unknown
    _csrf: string
    kage_file_max_size: number
    upload_kage_url: string
    p: string
  }

export interface IWebview {
    app: string
    webViewType: string
    appVersion: string
    os: string
    osVersion: string
    supportNavigation: boolean
    supportFilePicker: boolean
    supportExecUrlScheme: boolean
    supportMarketUrlScheme: boolean
}

export interface IContext {
    webType: string
    defaultEmail: unknown
    showStaySignIn: boolean
    defaultStaySignIn: boolean
    appendStaySignedIn: boolean
    defaultCountryCode: string
    showQrLogin: boolean
    showWebTalkLogin: boolean
    showDeviceFormLogin: boolean
    needCaptcha: boolean
    showIpSecurity: boolean
    loginUrl: string
    continueUrl: string
    useSimpleLogin: boolean
    exceedSimpleLoginLimit: boolean
    defaultSaveSignIn: boolean
    isTalkLoginError: boolean
    linkParams: ILinkParams
    requests: IRequests
}

export interface ILinkParams {
    lang: string[]
}

export interface IRequests {
    check_daum_sso: string[]
}

export interface IQuery {
}
