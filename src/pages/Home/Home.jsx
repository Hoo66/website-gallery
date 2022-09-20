import React, { useEffect, useState } from 'react'
import { getDocs, limit, orderBy, query, startAfter } from 'firebase/firestore'
import { SiteList } from '../../components/SiteList/SiteList'
import { websitesRef } from '../../firebase/config'
import './Home.scss'

export const Home = () => {
  const [data, setData] = useState(null) 
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(false)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  // Get collection data
  useEffect(() => {
    setIsPending(true)

    const fetchAllWebsites = async () => {
      try {
        const q = query(
          websitesRef, 
          orderBy('timestamp', 'desc'),
          limit(12)
        )
  
        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

        if(querySnap.empty) {
          setError('No data to load.')
          setIsPending(false)
        } else {
          let websites = []
          querySnap.docs.forEach((doc) => {
              websites.push({...doc.data(), id: doc.id})
          })
          setData(websites)
          setIsPending(false)
        }
      } catch (error) {
        setError(error.message)
        setIsPending(false)
      }
    }

    fetchAllWebsites()
  }, [])
    
  const fetchMoreWebsites = async () => {
    try {
      const q = query(
        websitesRef, 
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(12)
      )

      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)

      let websites = []
      querySnap.docs.forEach((doc) => {
          websites.push({...doc.data(), id: doc.id})
      })
      setData(prev => [...prev, ...websites])
      setIsPending(false)
    } catch (error) {
      setError(error.message)
      setIsPending(false)
    }
  }
  
  return (
    <>
      <SiteList 
        isPending={isPending}
        error={error}
        data={data}
      />
      {lastFetchedListing && (
        <p className='load-more' onClick={fetchMoreWebsites}>Load More</p>
      )}
    </>
  )
}