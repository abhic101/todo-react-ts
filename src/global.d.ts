export {};

declare global {
    interface ErrorConstructor {
        captureStackTrace?(targetObject: object, constructorOpt?: Function)
    }
}