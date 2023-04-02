import React, { useEffect, useRef, useState } from 'react'
import styles from '../styles/MessagesFlow.module.css'
import { useMessages, UsePostMessage } from '../hooks/messages'
import Image from 'next/image'
import userIcon from '../assets/user.png'
import backIcon from '../assets/back.png'
interface Props {
    conversationId: number;
    userId: number;
    friendName: string;
    handleBackClickForMobile: () => void
}

export function MessagesFlow ({conversationId, userId, friendName, handleBackClickForMobile}: Props) {
    const { messages, isLoading, error } = useMessages(conversationId)
    const {trigger, isMutating} = UsePostMessage(conversationId)
    const [message, setMessage] = useState('')
    const [hideMessages, setHideMessages] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.lastElementChild?.scrollIntoView();
    }, [conversationId, message, messages]);

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(message)
        try {
            await trigger({
                body: message,
                timestamp: Math.round(Date.now()/1000),
                authorId: userId,
                conversationId,
            } as any)
        } catch (e) {
            // error handling
        }
        setMessage('')
    };

    const handleBackClick = () => {
        handleBackClickForMobile()
    }

    return <>
        <div className={styles.header}>
            <Image className={styles.back} src={backIcon} alt="Back" width={30} height={30} onClick={handleBackClick}/>
            <Image src={userIcon} alt="User" width={40} height={40}/>
            {friendName}
        </div>
        <div className={styles.container} ref={bottomRef}>
        {messages?.map((mess) => {
            const isUserAuthor = mess.authorId === userId ? styles.messageUserAuthor : ''
            const date = new Date(mess.timestamp * 1000)
            const formattedDate = date.toLocaleDateString('en')
            const time = date.toLocaleTimeString()

            return <div className={[styles.message, isUserAuthor].join(' ')} key={mess.id}>
                {mess.body}
                <div className={styles.date}>
                    {formattedDate} {time}
                </div>
            </div>
        })}

    </div>
    <div className={styles.textarea}>
        <form>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            <button className="btn btn-primary" disabled={isMutating} onClick={onSubmit}>Submit</button>
        </form>
    </div>
    </>
}