import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useConversations } from '../hooks/conversations'
import { Loader } from '../components/Loader'
import { Error } from '../components/Error'
import { ConversationsList } from '../components/ConversationsList'
import { MessagesFlow }  from '../components/MessagesFlow'
import styles from '../styles/Messages.module.css'
import { Conversation } from '../types/conversation'

const MemoizedConversationsList = React.memo(ConversationsList);

export default function Messages () {
    const router = useRouter()
    const {
        query: { id, name }
    } = router;
    /* Router return stringify prop. Parse to number to respect defined type for user id. */
    const userIdRouter = parseInt(id as string, 10)
    const [ conversationId, setConversationId ] = useState<null | number>(null)
    const [ friendName, setFriendName ] = useState<string | undefined>(undefined)
    const [ userId, setUserId ] = useState<number | null>(null)
    const [ userName, setUserName ] = useState<string>('')
    const [ conversationsState, setConversations ] = useState<Conversation[]>([])

    /* XXX: For screen size width < 768 only
     *  Click on back icon display list of conversations
     *  Click on a conversation display messages
     **/
    const [ hideMessagesForMobileOnly, sethideMessagesForMobile ] = useState(false)

    /* Hooks */
    const { conversations, isLoading, error } = useConversations(userIdRouter)

    const onSelect = useCallback((conversationId: number, friendName: string) => {
        setConversationId(conversationId)
        setFriendName(friendName)
        sethideMessagesForMobile(false)
    }, [])

    const handleBackClickForMobile = () => {
        sethideMessagesForMobile(true);
    }

    useEffect(() => {
        if (userIdRouter && name.length) {
            setUserId(userIdRouter)
            setUserName(name as string)
            localStorage.setItem('userId', JSON.stringify(userIdRouter))
            localStorage.setItem('userName', JSON.stringify(name))
        } else  {
            setUserId(JSON.parse(localStorage.getItem('userId')))
            setUserName(JSON.parse(localStorage.getItem('userName')))
        }

    }, [userIdRouter, name])

    useEffect(() => {
        if (conversationId) {
            localStorage.setItem('conversationId', JSON.stringify(conversationId))
        } else {
            setConversationId(JSON.parse(localStorage.getItem('conversationId')))
        }
    }, [conversationId])

    useEffect(() => {
        if (friendName) {
            localStorage.setItem('friendName', JSON.stringify(friendName))
        } else {
            setFriendName(JSON.parse(localStorage.getItem('friendName')))
        }
    }, [friendName])

    useEffect(() => {
        if (conversations && conversations.length) {
            setConversations(conversations)
            localStorage.setItem('conversations', JSON.stringify(conversations))
        } else  {
            setConversations(JSON.parse(localStorage.getItem('conversations')))
        }
    }, [conversations])

    useEffect(() => {
        const handleResize = (evt) => {
            if (evt.target.innerWidth > 768) {
                sethideMessagesForMobile(false)
            }
        }

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }

    }, [])

    if (isLoading) return <Loader/>
    if (error) return <Error error={error}/>

    return (
        <>
            <div className={styles.welcome}>Welcome {userName} </div>
            <div className={styles.container}>
                <MemoizedConversationsList
                    conversations={conversationsState}
                    userId={userId}
                    handleSelect={onSelect}
                />
                {!hideMessagesForMobileOnly &&
                <div className={styles.messages__container}>
                    {conversationId &&
                    <MessagesFlow
                        conversationId={conversationId}
                        userId={userId}
                        friendName={friendName}
                        handleBackClickForMobile={handleBackClickForMobile}
                    />}
                </div>}
            </div>
        </>
    )
}
