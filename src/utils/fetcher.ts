

interface InfoMessage {
    message?: string;
}

export class MyError extends Error {
    status: number;
    info: InfoMessage;

    constructor(message: string, status: number, info: InfoMessage) {
        super(message);
        this.status = status;
        this.info = info;
    }
}

export const fetcher = async (url: string) => {
    const res = await fetch(url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json'
        },
        method: 'GET',
    })

    if (!res.ok) {
        const info = await res.json()
        const status = res.status
        const error = new MyError('An error occurred while fetching the data.', status, info)

        throw error
    }

    const data = await res.json();

    return data;
}