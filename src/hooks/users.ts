
import useSWR from 'swr'
import { User } from '../types/user'

const fetcher = async (url: string) => {
    const res = await fetch(url, {
        method: 'GET',
    })

    const data = await res.json()

    return data
}

export function useUsers() {
    const { data, error, isLoading } = useSWR<User[], Error>('http://localhost:3005/users', fetcher)

    return {
        users: data,
        isLoading,
        isError: error,
    }
}
