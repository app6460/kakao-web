/*
 * Created on Mon Nov 06 2023
 *
 * Copyright (c) app6460. Licensed under the MIT License.
 */

export * from './tiara-factory';

export interface ITrackObject {
    sdk: ISdk
    env: IEnv
    common: ICommon
    etc: IEtc
    action: IAction
}

export interface ISdk {
    type: string
    version: string
}

export interface IEnv {
    screen: string
    tz: string
    cke: string
}

export interface ICommon {
    svcdomain: string
    deployment: string
    url: string
    section: string
    page: string
}

export interface IEtc {
    client_info: IClientInfo
}

export interface IClientInfo {
    tuid: string
    tsid: string
    uuid: string
    suid: string
    isuid: string
    client_timestamp: number
}

export interface IAction {
    type: string
    name: string
    kind: string
}
