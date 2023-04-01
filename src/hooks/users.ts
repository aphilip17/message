import useSWR from 'swr'
import { User } from '../types/user'
import { MyError, fetcher } from '../utils/fetcher'

export function useUsers() {
    const { data, error, isLoading } = useSWR<User[], Error>('http://localhost:3005/users', fetcher)

    return {
        users: data,
        isLoading,
        error: error as MyError
    }
}
