import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { useConversations } from '../hooks/conversations'
import { Loader } from '../components/Loader'
import { Error } from '../components/Error'
import { ConversationsList } from '../components/ConversationsList'
import { MessagesFlow }  from '../components/MessagesFlow'
import styles from '../styles/Messages.module.css'

export default function Messages () {
    const router = useRouter()
    const userId = parseInt(router.query.id as string, 10)
    const { conversations, isLoading, error } = useConversations(userId)
    const [ conversationId, setConversationId ] = useState(undefined)
    const bottomRef = useRef<HTMLDivElement>(null);

    const onSelect = (conversationId) => {
        setConversationId(conversationId);
    }

    if (isLoading) return <Loader/>
    if (error) return <Error error={error}/>

    return <>
        <div className={styles.welcome}>Welcome {router.query.name} </div>
        <div className={styles.container}>
            <ConversationsList
                conversations={conversations}
                userId={userId}
                onSelect={onSelect}
            />
            <div className={styles.messages__container}>
                {conversationId &&
                <MessagesFlow
                    conversationId={conversationId}
                    userId={userId}
                />}
            </div>
        </div>
    </>
}
