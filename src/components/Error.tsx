import React from 'react'
import { MyError } from '../utils/fetcher'

export function Error ({error}: {error: MyError}) {
    return  <div className='alert alert-warning' role='alert'>
        <h3>Error {error.status}</h3>
        <div>{error.message}</div>
        <div>{error.info?.message}</div>
    </div>
}
