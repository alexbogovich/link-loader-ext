export interface PromisifyMe {
    __export_id: string
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
