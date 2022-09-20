import { useEffect, useState } from 'react'
import { db, auth, storage } from '../../firebase/config'
import { updateProfile, updateEmail, EmailAuthProvider,  reauthenticateWithCredential } from 'firebase/auth'
import { doc, getDoc, getDocs, query, where, orderBy, collection, updateDoc, deleteDoc } from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { SiteList } from '../../components/SiteList/SiteList'
import './MyPage.scss'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Modal } from '../../components/Modal/Modal'

export const MyPage = () => {
  const [websitesData, setWebsitesData] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState(null)
  const [showNameChangeButton, setShowNameChangeButton] = useState(true)
  const [showEmailChangeButton, setShowEmailChangeButton] = useState(true)
  const [showIntroEditButton, setShowIntroEditButton] = useState(true)
  const [editedName, setEditedName] = useState(auth.currentUser.displayName)
  const [editedEmail, setEditedEmail] = useState(auth.currentUser.email)
  const [editedIntroduction, setEditedIntroduction] = useState(null)
  const [password, setPassword] = useState('')
  const [userProfile, setUserProfile] = useState(null)
  const navigate = useNavigate()
  const isEditable = true
  const [openModal, setOpenModal] = useState(false)
  const [selectedWebsite, setSelectedWebsite] = useState(null)
  const confirmation = 'ウェブサイトを削除してもよろしいですか？'
  const confirmationButtonText = '削除する'

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const docRef = doc(db, 'users', auth.currentUser.uid)
        const docSnap = await getDoc(docRef)
        if(docSnap.exists()) {
          setUserProfile(docSnap.data())
        } 
      } catch (error) {
        toast.error('ユーザー情報が取得できませんでした')
      }
    }

    fetchUserProfile()
  }, [])

  useEffect(() => {
    setIsPending(true)

    const fetchMyWebsites = async () => {
      try {
        const q = query(
          collection(db, "websites"), 
          where("creator", "==", auth.currentUser.uid),
          orderBy("timestamp", "desc"),
        )
  
        const querySnap = await getDocs(q)

        if(querySnap.empty) {
          setError('No data to load.')
          setIsPending(false)
        } else {
          let websites = []
          querySnap.docs.forEach((doc) => {
              websites.push({...doc.data(), id: doc.id})
          })
          setWebsitesData(websites)
          setIsPending(false)
        }
      } catch (error) {
        setError(error.message)
        setIsPending(false)
      }
    }

    fetchMyWebsites()
  }, [])

  const toggleNameChangeButton = () => {
    setShowNameChangeButton(prev => !prev)
  }
  const toggleEmailChangeButton = () => {
    setShowEmailChangeButton(prev => !prev)
  }
  const toggleIntroEditButton = () => {
    setShowIntroEditButton(prev => !prev)
  }

  const refreshPage = () => {
    window.location.reload()
  }

  const changeDisplayName = async () => {
    await updateProfile(auth.currentUser, {displayName: editedName})
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {name: editedName})
    navigate('/mypage')
    refreshPage()
    toast.success('ユーザー名が変更されました')
  }
  
  
  const changeEmail = async () => {
    const user = auth.currentUser
    try {
      const credential = await EmailAuthProvider.credential(
        user.email,
        password
      )
      user && (await reauthenticateWithCredential(user, credential))
      await updateEmail(auth.currentUser, editedEmail)

    } catch (error) {
      toast.error('Emailアドレスが変更できませんでした')
    }
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {email: editedEmail})
    navigate('/mypage')
    refreshPage()
    toast.success('Emailアドレスが変更されました')
  }

  const editIntroduction = async () => {
    try {
      if(editedIntroduction !== null) {
        const docRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(docRef, {introduction: editedIntroduction})
        refreshPage()
        toast.success('Introductionが更新されました')
      } else {
        toast.error('Introductionは編集されていません')
      }
    } catch (error) {
      toast.error('Introductionを更新できませんでした')
    }
  }

  const editWebsite = (e) =>{
    navigate(`/edit-website/${e.target.id}`)
  }

  const confirmDelete = (e) => {
    setOpenModal(true)
    setSelectedWebsite(e.target.id)
    console.log(e.target.id)
  }
  const closeModal = () => {
    setOpenModal(false)
  }

  const deleteWebsite = async () => {
    const websiteSnap = await getDoc(doc(db, 'websites', selectedWebsite))
    await deleteObject(ref(storage, `images/${websiteSnap.data().imageFileName}`))
    await deleteDoc(doc(db, "websites", selectedWebsite))
    refreshPage()
    toast.success('Websiteが削除されました')
  }


  return (
    <div className='mypage'>
      <h2>My Page</h2>
      <div className="container">
        <div className="section edit-name">
          <h3>Name: </h3>
          <div className="flex">
            <p className={showNameChangeButton ? "" : "hide"}>
              {auth.currentUser.displayName}
            </p>
            <input 
              type="text" 
              minLength="4"
              value={editedName} 
              className={showNameChangeButton ? "hide" : ""}
              onChange={e => setEditedName(e.target.value)}
            />
            <button
              onClick={toggleNameChangeButton}
            >{showNameChangeButton? "変更" : "Cancel"}</button>
            <button 
              className={showNameChangeButton ? "hide" : ""} 
              onClick={changeDisplayName}
            >変更を保存</button>
          </div>
        </div>
        
        <div className="section edit-email">
          <h3>Email:</h3>
          <div className="flex">
              <p className={showEmailChangeButton ? "" : "hide"}>
                {auth.currentUser.email}
              </p>
            
            <input 
              type="email" 
              value={editedEmail} 
              className={showEmailChangeButton ? "hide" : ""}
              onChange={e => setEditedEmail(e.target.value)}
            />
            <input 
              type="password" 
              value={password} 
              placeholder="Password"
              className={showEmailChangeButton ? "hide" : ""}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={toggleEmailChangeButton}
            >{showEmailChangeButton ? "変更" : "Cancel"}</button>
            <button
              className={showEmailChangeButton ? "hide" : ""}
              onClick={changeEmail}
            >変更を保存</button>
          </div>
        </div>

        <div className="section edit-introduction">
          <h3>Introduction(400字まで):</h3>
          <p className={showIntroEditButton ? "" : "hide"}>
            {userProfile && userProfile.introduction}
          </p>
          <textarea 
            name=""
            defaultValue={userProfile && userProfile.introduction}
            maxLength="2000"
            onChange={e => setEditedIntroduction(e.target.value)}
            className={showIntroEditButton ? "hide" : ""}
          >
          </textarea>
          <button
            onClick={toggleIntroEditButton}
          >{showIntroEditButton ? "変更" : "Cancel"}</button>
          <button
            className={showIntroEditButton ? "hide" : ""}
            onClick={editIntroduction}
          >変更を保存</button>
        </div>

        <Link to="/delete-account" className='delete-account-link'>アカウントを削除する</Link>

      <h3>My Websites:</h3>
      <SiteList
        isPending={isPending}
        error={error}
        data={websitesData}
        editWebsite={editWebsite}
        confirmDelete={confirmDelete}
        isEditable={isEditable}
      > 
      </SiteList>
      </div>
      
      {openModal && 
        <Modal 
          confirmation={confirmation}
          confirmationButtonText={confirmationButtonText}
          closeModal={closeModal}
          execute={deleteWebsite} 
        />
      }
    </div>
  )
  
}