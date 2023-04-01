import { useRouter } from 'next/router'
import React, { useState } from 'react'
import { useConversations } from '../hooks/conversations'

import { Loader } from '../components/Loader'
import { Error } from '../components/Error'
import { ConversationsList } from '../components/ConversationsList'

export default function Messages () {
    const router = useRouter()
    const userId = router.query.id as string
    const { conversations, isLoading, error } = useConversations(userId)
    const [ conversationId, setConversationId ] = useState(undefined)

    const onSelect = (conversationId) => {
        setConversationId(conversationId);
    }

    if (isLoading) return <Loader/>
    if (error) return <Error error={error}/>

    return <ConversationsList
        conversations={conversations}
        userName={router.query.name as string}
        userId={userId}
        onSelect={onSelect}
    ></ConversationsList>
}
