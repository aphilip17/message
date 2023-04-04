import React, { useState } from 'react';
import Image from 'next/image'
import styles from '../styles/Conversations.module.css'
import userIcon from '../assets/user.png'
import { Conversation } from '../types/conversation'

interface Props {
    conversations: Conversation[] | undefined;
    userId: number;
    handleSelect: (id: number, friendName: string) => void;
}

export function ConversationsList ({ conversations, userId, handleSelect}: Props) {
    const [ conversationState, setConversation ] = useState(undefined)

    const onSelect = (conversationId, friendName) => {
        setConversation(conversationId)
        handleSelect(conversationId, friendName)
    }

    return (
        <div className={styles.container}>
            {conversations?.map((conv) => {
               return (
                    <MemoizedConv
                        key={conv.id}
                        conversation={conv}
                        userId={userId}
                        selected={conversationState === conv.id}
                        onSelect={onSelect}
                    />
                )
            })}
        </div>
    )
}
interface ConversationProps {
    conversation: Conversation;
    userId: number;
    selected: boolean;
    onSelect: (id: number, friendName: string) => void;
}
/* Memoize to avoid re-render each time a conversation is selected. */
const MemoizedImage = React.memo(Image);
const MemoizedConv = React.memo(Conversation);

export function Conversation ({conversation, userId, selected, onSelect}: ConversationProps) {
    const friendName = conversation.senderId === userId
                     ? conversation.recipientNickname
                     : conversation.senderNickname
    const selectedClass = selected ? styles.selectedCard : null

    const handleClick = () => {
        onSelect(conversation.id, friendName)
    }

    return (
         <div
            className={[styles.card, selectedClass].join(' ')}
            onClick={handleClick}
        >
            <MemoizedImage
                src={userIcon}
                alt='User'
                width={40}
                height={40}
            />
        <div>
            <div>{friendName}</div>
        </div>
        </div>
    )
}