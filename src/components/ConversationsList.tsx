import React, { useState } from 'react'
import Image from 'next/image'
import styles from '../styles/Conversations.module.css'
import userIcon from '../assets/user.png'
import { Conversation } from '../types/conversation'

interface Props {
    conversations: Conversation[] | undefined;
    userId: number;
    onSelect: (id: string, friendName: string) => void;
}
/* Memoize to avoid re-render each time a conversation is selected. */
const MemoizedImage = React.memo(Image);

export function ConversationsList ({ conversations, userId, onSelect}: Props) {
    const [ conversationId, setConversationId ] = useState(undefined)

    const handleClick = (conversationId, friendName) => {
        setConversationId(conversationId)
        onSelect(conversationId, friendName)
    }

    return <div className={styles.container}>
            {conversations?.map((conv) => {
                const friendName = conv.senderId === userId ? conv.recipientNickname : conv.senderNickname
                const date = new Date(conv.lastMessageTimestamp * 1000)
                const formattedDate = date.toDateString()
                const selected = conversationId === conv.id ? styles.selectedCard : '';

                return <div
                    className={[selected, styles.card].join(' ')}
                    key={conv.id}
                    onClick={() => { handleClick(conv.id, friendName) }}
                >
                    <MemoizedImage src={userIcon} alt="User" width={40} height={40}/>
                    <div>
                        <div>{friendName}</div>
                        <div>{formattedDate}</div>
                    </div>
                </div>
            })}
        </div>
}