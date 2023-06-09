import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/MessagesFlow.module.css'
import { useMessages, UsePostMessage } from '../hooks/messages'
import Image from 'next/image'
import userIcon from '../assets/user.png'
import backIcon from '../assets/back.png'
import { Loader } from './Loader'
import { Error } from './Error'
import { Message } from './Message'

interface Props {
    conversationId: number;
    userId: number;
    friendName: string;
    handleBackClickForMobile: () => void
}

const MemoizedImage = React.memo(Image)

export function MessagesFlow ({ conversationId, userId, friendName, handleBackClickForMobile }: Props) {
    /* Hooks */
    const { messages, isLoading, error } = useMessages(conversationId)
    const { trigger, isMutating } = UsePostMessage(conversationId)

    const [ message, setMessage ] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null);

    const dateTitleList = new Set()

    useEffect(() => {
        bottomRef.current?.lastElementChild?.scrollIntoView();
    }, [conversationId, message, messages]);

    const onSubmit = async (event) => {
        event.preventDefault()

        try {
            await trigger({
                body: message,
                timestamp: Math.round(Date.now() / 1000),
                authorId: userId,
                conversationId,
            } as any)
        } catch (e) {
            throw error
        }
        setMessage('')
    }

    const handleBackClick = () => {
        handleBackClickForMobile()
    }

    if (isLoading) return <Loader/>
    if (error) return <Error error={error}/>

    const messagesNodes = []
    {Object.entries(messages).forEach(([key, value]) => {
        messagesNodes.push(<MessagesSorted
            key={key}
            dateTitle={key}
            messageSorted={value as Array<Date>}
            userId={userId}
        />)
    })}

    return (
        <>
            <div className={styles.header}>
                <MemoizedImage
                    className={styles.back}
                    src={backIcon} alt='Back'
                    width={30}
                    height={30}
                    onClick={handleBackClick}
                />
                <MemoizedImage
                    src={userIcon}
                    alt='User'
                    width={40}
                    height={40}
                />
                {friendName}
            </div>
            <div
                className={styles.container}
                ref={bottomRef}
                tabIndex={0}
            >
            {messagesNodes}

            </div>
            <div className={styles.textarea}>
                <form>
                    <textarea
                        placeholder='Enter a message'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        className='btn btn-primary'
                        disabled={isMutating || !message.length}
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </form>
            </div>

        </>
    )
}

interface MessagesSortedProps {
    dateTitle: string;
    messageSorted: Date[];
    userId: number;
}

function MessagesSorted({ dateTitle, messageSorted, userId }: MessagesSortedProps) {
    return (
        <>
            <div className={styles.datetitle}>{dateTitle}</div>
            {messageSorted?.map((message, idx) => {
                return <Message
                    key={idx}
                    message={message}
                    userId={userId}
                />
            })}
        </>
    )
}
