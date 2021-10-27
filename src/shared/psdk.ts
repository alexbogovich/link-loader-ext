import handlerProvider from './utils/handler-provider';
import { SDK } from '../background/sdk';

export interface PromisifyMe {
    PROMISIFY_EXPORT_ID: string
}

type OmitLastMessageSender<T extends any[]> =
    T extends [...infer Head, chrome.runtime.MessageSender | undefined | null] ? Head : any[];

export type PromisifyFunction<F extends (...any: any[]) => any> =
    (...args: OmitLastMessageSender<Parameters<F>>) => ReturnType<F> extends Promise<any>
        ? ReturnType<F>
        : Promise<ReturnType<F>>;

export type PromisifyBase<Base> = {
    [Key in keyof Base]: Base[Key] extends PromisifyMe
        ? PromisifyBase<Base[Key]>
        : Base[Key] extends ((...any: any[]) => any)
            ? PromisifyFunction<Base[Key]>
            : Promise<Base[Key]>
}

export type PromisifiedSDK = PromisifyBase<SDK>

export const psdk = new Proxy({}, handlerProvider()) as PromisifiedSDK;
