/* eslint-disable @typescript-eslint/ban-types */
import handlerProvider from './utils/handler-provider';
import { SDK } from '../background/sdk';

export interface PromisifyMe {
    PROMISIFY_EXPORT_ID: string
}

export type PromisifyFunction<Function extends (...any: any[]) => any> =
    (...args: Parameters<Function>) => ReturnType<Function> extends Promise<any>
        ? ReturnType<Function>
        : Promise<ReturnType<Function>>;

export type PromisifyBase<Base> = {
    [Key in keyof Base]: Base[Key] extends PromisifyMe
        ? PromisifyBase<Base[Key]>
        : Base[Key] extends ((...any: any[]) => any)
            ? PromisifyFunction<Base[Key]>
            : Promise<Base[Key]>
}

export type PromisifiedSDK = PromisifyBase<SDK>

export const psdk = new Proxy({}, handlerProvider()) as PromisifiedSDK;
