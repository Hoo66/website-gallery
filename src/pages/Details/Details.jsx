import React, { useState, useEffect } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import './Details.scss'


export const Details = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null) 
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  const [creatorName, setCreatorName] = useState(null)

  useEffect(() => {
    setIsPending(true)

    const fetchDoc = async () => {
      try {
        const docRef = doc(db, 'websites', id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setData(docSnap.data())
          setIsPending(false)
        } 
        else {
          const toastID = 'noData'
          toast.error('ウェブサイトが見つかりません', { toastId: toastID })
          navigate('/')
        }
      } catch (error) {
        setError(error.message)
        setIsPending(false)
      }
    }
    
    fetchDoc()
    
  }, [id])

  useEffect(() => {
    const fetchCreatorProfile = async () => {
      if(data) {
        const creator = await data.creator
        const creatorRef = doc(db, 'users', creator)
        const creatorSnap = await getDoc(creatorRef)
        setCreatorName(creatorSnap.data().name)
      }
    }  
  
      fetchCreatorProfile()
  }, [data])

  const trimTechs = (techs) => {
    let displayTechs = ''
    
    for (let i = 3; i < techs.length; i++) {
      if(techs[i] === '' || techs[i] === 'other') {
        continue
      } else {
        displayTechs += `${techs[i]}, `
      }
    }
    for (let i = 0; i <= 2; i++) {
      if(techs[i] !== "") {
        displayTechs += `${techs[i]}, `
      }
    }
    if(displayTechs.endsWith(', ')) {
      displayTechs = displayTechs.slice(0, displayTechs.length - 2)
    }
    return displayTechs
  }

  return (
    <div className="details">
       {error && <p className='error'>{error}</p>}
       {isPending && <p className='loading'>Loading...</p>}
       {data && creatorName && (
         <> 
            <h2>{data.title}</h2> 
            <p className='creator-name'>Created by <Link to={`/creators/${data.creator}`}>{creatorName}</Link></p>
            <div className='img-container'> 
              <img src={data.imageUrl} alt='website' /> 
            </div> 
            <h3>使用した言語・ツール</h3>
            <p>{trimTechs(data.techs)}</p> 
            <h3>詳細</h3>
            <p className='description'>{data.description}</p> 
            <a className='site-link' href={data.websiteUrl} target="_blank" rel="noopener noreferrer">Go to the website</a>
         </>
       )} 
    </div>
  )
}