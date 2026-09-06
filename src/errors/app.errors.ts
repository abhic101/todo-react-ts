class AppError extends Error {
    public statusCode = 1500;
    public name: string;
    constructor(message: string, options: any = {}) {
        super(message, options);
        this.name = this.constructor.name;

        // Object.setPrototypeOf(this, new.target.prototype);

        if (Error.captureStackTrace)
            Error.captureStackTrace(this, this.constructor);
    }
}

class InvalidArgError extends AppError {
    public statusCode = 1501;

    constructor(message: string, options: any = {}) {
        super(message, options);

        // Object.setPrototypeOf(this, new.target.prototype);
    }
}

export {
    AppError,
    InvalidArgError
}