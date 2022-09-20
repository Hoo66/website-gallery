import React from 'react'
import { Link } from 'react-router-dom'
import './NotFound.scss'

export const NotFound = () => {
  return (
    <div className='not-found'>
      <h3>お探しのページが<br />見つかりませんでした</h3>
      <Link to='/'>Topへ戻る</Link>
    </div>
  )
}