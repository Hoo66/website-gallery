import { deleteUser, EmailAuthCredential, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth"
import { deleteDoc, doc, query, getDoc, getDocs, collection, where } from "firebase/firestore"
import { deleteObject, ref } from "firebase/storage"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { auth, db, storage } from "../../firebase/config"
import './DeleteAccount.scss'


export const DeleteAccount = () => {
  const navigate = useNavigate()
  const user = auth.currentUser
  const uid = user.uid
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const deleteAcount = async () => {
    const credential = await EmailAuthProvider.credential(
      user.email,
      password
    )
    const userDoc = doc(db, "users", uid)
    const websiteQuery = query(collection(db, "websites"), where("creator", "==", user.uid))

    const refreshPage = () => {
      window.location.reload()
    }

    try {
      const result = await reauthenticateWithCredential(
        auth.currentUser,
        credential
      )
      await deleteDoc(userDoc)
      const websitesSnap = await getDocs(websiteQuery)
      await websitesSnap.forEach(snap => {
        deleteDoc(doc(db, "websites", snap.id))
        console.log(snap.data())
        deleteObject(ref(storage, `images/${snap.data().imageFileName}`))
      })
      await deleteUser(result.user)
      toast.success('アカウントを削除しました')
      navigate('/')
      refreshPage()
    } catch (error) {
      toast.error('エラーが発生しました')
    }
  }

  return (
    <div className="delete-account form-container container">
      <h2>アカウント削除</h2>
      <p>アカウントを削除するとすべてのデータが削除されます。</p>
      <p>削除する場合はEmailとパスワードを入力してください。</p>
      <input 
        type="email" 
        value={email} 
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
      />
      <input 
        type="password" 
        value={password} 
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
      />
      <button onClick={deleteAcount}>削除する</button>
      <Link to="/mypage" className="back-to-mypage">マイページへ戻る</Link>
    </div>
  )
}