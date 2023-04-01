import React from 'react'
import styles from '../styles/MessagesFlow.module.css'
import { useMessages } from '../hooks/messages'

interface Props {
    conversationId: string;
    userId: string;
}

export function MessagesFlow ({conversationId, userId}: Props) {
    const { messages, isLoading, error } = useMessages(conversationId)

    return <div className={styles.container}>
        {messages?.map((mess) => {
            const isUserAuthor = mess.authorId === parseInt(userId, 10) ? styles.messageUserAuthor : '';
            const date = new Date(mess.timestamp * 1000);
            const formattedDate = date.toLocaleDateString('en');
            const time = date.toLocaleTimeString();

            return <div className={[styles.message, isUserAuthor].join(' ')} key={mess.id}>
                {mess.body}
                <div className={styles.date}>
                    {formattedDate} {time}
                </div>
            </div>
        })}
    </div>
}