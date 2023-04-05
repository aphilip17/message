import React, { useCallback, useEffect, useRef, useState } from 'react';
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
    const [ htmlConversation, setHtmlConversation ] = useState<HTMLElement | undefined>(undefined)
    const prevCountRef = useRef<HTMLElement | undefined>()

    useEffect(() => {
        if (prevCountRef.current) (
            (prevCountRef.current).classList.remove(styles.selectedCard)
        )
        prevCountRef.current = htmlConversation

    }, [htmlConversation])

    const onSelect = useCallback((conversationId, friendName, elem) => {
        /* Manipule Dom to avoid re-render all elem of the list. */
        setHtmlConversation(elem)
        elem.classList.add(styles.selectedCard)

        handleSelect(conversationId, friendName)
    }, [handleSelect])

    return (
        <div className={styles.container}>
            {conversations?.map((conv) => {
                return (
                    <MemoizedConv
                        key={conv.id}
                        conversation={conv}
                        userId={userId}
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
    onSelect: (id: number, friendName: string, elem: HTMLElement) => void;
}
/* Memoize to avoid re-render each time a conversation is selected. */
const MemoizedImage = React.memo(Image)
const MemoizedConv = React.memo(Conversation)

export function Conversation ({conversation, userId, onSelect}: ConversationProps) {
    const friendName = conversation.senderId === userId
                     ? conversation.recipientNickname
                     : conversation.senderNickname

    const handleClick = (e) => {
        onSelect(conversation.id, friendName, e.currentTarget)
    }

    return (
         <div
            className={styles.card}
            onClick={handleClick}
        >
            <MemoizedImage
                src={userIcon}
                alt='User'
                width={40}
                height={40}
            />

        <div>{friendName}</div>
    </div>
    )
}