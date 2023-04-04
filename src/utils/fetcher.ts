

interface InfoMessage {
    message?: string;
}

export class MyError extends Error {
    status: number;
    info: InfoMessage;

    constructor(message: string, status: number, info: InfoMessage) {
        super(message)
        this.status = status
        this.info = info
    }
}

export const fetcher = async (url: string, arg?: { arg: { arg: any }}, options?: { method: string }) => {

    const fetchOptions = {
        credentials: 'include' as RequestCredentials,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        method: options?.method || 'GET',
        body: arg ? JSON.stringify(arg.arg) : undefined,
    }

    const res = await fetch(url, fetchOptions)

    if (!res.ok) {
        const info = await res.json()
        const status = res.status
        const error = new MyError('An error occurred while fetching the data.', status, info)

        throw error
    }

    const data = await res.json()

    return data
}
