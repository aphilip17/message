import useSWR from 'swr'
import { Message } from '../types/message'
import { MyError, fetcher } from '../utils/fetcher'

export function useMessages(conversationId) {
    const { data, error, isLoading } =
        useSWR<Message[], Error>('http://localhost:3005/messages/' + conversationId, fetcher)

    const sortedData = data?.sort((a, b) => a.id - b.id)

    return {
        messages: sortedData,
        isLoading,
        error: error as MyError
    }
}