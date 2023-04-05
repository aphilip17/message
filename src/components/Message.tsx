import React from 'react'
import styles from '../styles/MessagesFlow.module.css'

interface Props {
    message: any;
    userId: number;
}

export function Message ({ message, userId }: Props) {
    const isUserAuthor = message.authorId === userId ? styles.messageUserAuthor : ''

    return (
        <div
            className={[styles.message, isUserAuthor].join(' ')}
            key={message.id}
        >
            {message.body}
            <div className={styles.date}>
                {message.time}
            </div>
        </div>
    )
}