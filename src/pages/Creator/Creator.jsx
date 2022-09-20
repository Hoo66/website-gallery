import { useParams, useNavigate } from "react-router-dom"
import { doc, getDocs, getDoc, query, where } from "firebase/firestore"
import { db, websitesRef, usersRef } from "../../firebase/config"
import { useEffect, useState } from "react"
import { SiteList } from "../../components/SiteList/SiteList"
import { toast } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import './Creator.scss'

export const Creator = () => {
  const [data, setData] = useState(null)
  const [userData, setUserData] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setIsPending(true)
    
    const fetchWebsitesData = async () => {
      try {
        const q = query(websitesRef, where('creator', '==', id))

        const snapshot = await getDocs(q)
  
        if (snapshot.empty) {
          setError('No data to load')
          setIsPending(false)
        } else {
          const results = []
          snapshot.forEach(doc => {
            results.push({...doc.data(), id: doc.id})
          })
          setData(results)
          setIsPending(false)
        }
        
      } catch(err) {
        setError(error.message)

      }
      
    }
    
    fetchWebsitesData()
  }, [id])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', id)
        const userSnap = await getDoc(userRef)
        if(userSnap.exists()) {
          setUserData(userSnap.data())
        } else {
          const toastID = 'noData'
          toast.error('クリエイターが見つかりません', { toastId: toastID })
          navigate('/')
        }
      } catch(error) {
        toast.error('エラーが発生しました。')
      }
    }

    fetchUserData()
  }, [id])

  return (
    <div className="creator">
      <h2>Creator's Profile</h2>
      <div className="container">
        {userData && (
          <>
            <h3>Name:</h3>
            <p>{userData.name}</p>
            <h3>Introduction:</h3>
            <p>{userData.introduction}</p>
          </>
        )}
        <h3>My Websites:</h3>
        <SiteList 
          isPending={isPending}
          error={error}
          data={data}
        />
      </div>
    </div>
  )
}