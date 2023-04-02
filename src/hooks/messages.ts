import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { Message } from '../types/message'
import { MyError, fetcher } from '../utils/fetcher'

export function useMessages(conversationId: number) {
    const { data, error, isLoading } =
        useSWR<Message[], Error>('http://localhost:3005/messages/' + conversationId, fetcher)

    const sortedData = data?.sort((a, b) => a.id - b.id)

    return {
        messages: sortedData,
        isLoading,
        error: error as MyError
    }
}

export function UsePostMessage(conversationId: number) {
    const { trigger, isMutating }  = useSWRMutation('http://localhost:3005/messages/' + conversationId,
                                                    (url, options) => fetcher(url, options, {method: 'POST'}))

    return {
        trigger,
        isMutating,
    }
}
