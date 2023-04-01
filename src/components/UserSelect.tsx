import React from 'react'
import { useUsers } from '../hooks/users'
import { Loader } from './Loader'
import { Error } from './Error'
import { useRouter } from 'next/router'
interface User {
    id: string;
   name: string;
}

export function UserSelect () {
    const { users, isLoading, error } = useUsers()
    const router = useRouter()

    const handleChange = function(event: React.ChangeEvent<HTMLSelectElement>) {
        const id = event.target.value;
        const user = users.find(user => user.id === parseInt(id, 10))

        router.push({
            pathname: '/messages',
            query: {id: parseInt(event.target.value, 10), name: user!.nickname}
        }, '/messages')
    }

    if (isLoading) return <Loader/>
    if (error) return <Error error={error}/>

    return <>
        <select
            className="form-select form-select-lg mb-3"
            aria-label=".form-select-lg example"
            onChange={handleChange}
        >
            <option defaultValue='defaultValue'>Choose a user</option>
            {users?.map((user, idx) => {
                return <option key={idx} value={user.id}>{user.nickname}</option>
            })}
        </select>
    </>
}
