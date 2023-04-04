import React from 'react'
import { Message } from '../types/message'
import styles from '../styles/MessagesFlow.module.css'

interface Props {
    message: Message;
    userId: number;
}

export function Message ({ message, userId }: Props) {
    const isUserAuthor = message.authorId === userId ? styles.messageUserAuthor : ''
    const date = new Date(message.timestamp * 1000)
    const formattedDate = date.toLocaleDateString('en')
    const time = date.toLocaleTimeString()

    return (
        <div
            className={[styles.message, isUserAuthor].join(' ')}
            key={message.id}
        >
            {message.body}
            <div className={styles.date}>
                {formattedDate} {time}
            </div>
        </div>
    )
}