import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { Message } from '../types/message'
import { MyError, fetcher } from '../utils/fetcher'

export function useMessages(conversationId: number) {
    const messageMap = {}
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const { data, error, isLoading } =
        useSWR<Message[], Error>('http://localhost:3005/messages/' + conversationId, fetcher)

    const sortedData = data?.sort((a, b) => a.id - b.id)

    function getdayDuration(messageDate: Date) {
        const d1 = messageDate
        const d2 = new Date()

        const diff = d2.getTime() - d1.getTime()

        return diff / (1000 * 60 * 60 * 24)
    }

    sortedData?.forEach((message) => {
        const date = new Date(message.timestamp * 1000)
        const durationDay = getdayDuration(date)
        const todayDate = new Date()
        let dateTitle

        if (date.toLocaleDateString() === todayDate.toLocaleDateString()) {
            dateTitle = 'Today'
        } else if (durationDay < 4) {
            dateTitle = days[new Date(date.getTime()).getDay()]
        } else {
            dateTitle = date.toLocaleDateString('en')
        }
        const time = date.toLocaleTimeString()

        if (messageMap[dateTitle]) {
            messageMap[dateTitle].push({authorId: message.authorId, time: time, body: message.body})
        } else {
            messageMap[dateTitle] = [{authorId: message.authorId, time: time, body: message.body}]
        }
    })

    return {
        messages: messageMap,
        isLoading,
        error: error as MyError
    }
}

export function UsePostMessage(conversationId: number) {
    const { trigger, isMutating }  = useSWRMutation('http://localhost:3005/messages/' + conversationId,
                                                    (url, options) => fetcher(url, options, { method: 'POST' }))

    return {
        trigger,
        isMutating,
    }
}
