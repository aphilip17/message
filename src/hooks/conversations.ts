import useSWR from 'swr'
import { Conversation } from '../types/conversation'
import { MyError, fetcher } from '../utils/fetcher'

export function useConversations(userId: number | null) {

    const { data, error, isLoading } = useSWR<Conversation[], Error>('http://localhost:3005/conversations/' + userId, fetcher)

    return {
        conversations: data,
        isLoading,
        error: error as MyError
    }
}