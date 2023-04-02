import React, { useState, useEffect } from 'react'
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
    const [ friendName, setFriendName ] = useState('')
    /* XXX: If screen size width is lower than 768 (like for mobiles) the layout
     * is different... using media queries in Css is not enough to manage this case.
     * When size screen is lower than 768 the messages layout or the discussion layout
     * is display on the entire page. When the messages layout is displayed, a click on
     * the back icon will display the layout of the discussions. And a click on a
     * discussion will display the layout of the messages. */
    const [ hideMessagesForMobileOnly, sethideMessagesForMobile] = useState(false)

    const onSelect = (conversationId, friendName) => {
        console.log(conversationId, friendName)
        setConversationId(conversationId)
        setFriendName(friendName)
        sethideMessagesForMobile(false)
    }

    const handleBackClickForMobile = () => {
        sethideMessagesForMobile(true);
    }

    useEffect(() => {
        const handleResize = (evt) => {
            if (evt.target.innerWidth > 768) {
                sethideMessagesForMobile(false)
            }
        }
           window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        };

      }, []);

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
}
