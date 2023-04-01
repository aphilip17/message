import React from 'react'
import { useUsers } from '../hooks/users'
import { Loader } from './Loader'
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
            query: {id: event.target.value, name: user!.nickname}
        }, '/messages')
    }

    if (isLoading) return <Loader />
    if (error) {
        return <>
            <div className="alert alert-warning" role="alert">
                <h3>Error {error.status}</h3>
                <div>{error.message}</div>
                <div>{error.info.message}</div>
            </div>
        </>
    }

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
