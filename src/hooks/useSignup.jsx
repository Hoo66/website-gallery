import { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "./useAuthStatus";

export const useSignup = () => {
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const refreshPage = () => {
    window.location.reload()
  }

  const signup = async (email, password, name, formData) => {
    setIsPending(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if(!user) {
        throw new Error('Could not signup')
      }

      // add display name to user
      updateProfile(auth.currentUser, {displayName: name})

      const formDataCopy = {...formData}
      delete formDataCopy.password
      formDataCopy.timestamp = serverTimestamp()
      formDataCopy.introduction = "未記入"

      await setDoc(doc(db, 'users', user.uid), {
        ...formDataCopy,
      })

      setIsPending(false)
      navigate('/mypage')
      refreshPage()
    } catch(error) {
      switch(error.code) {
        case 'auth/email-already-in-use':
          toast.error('入力されたメールアドレスはすでに使用されています');
          break;
        case 'auth/weak-password':
          toast.error('パスワードは六文字以上必要です');
          break;
        case 'auth/too-many-requests':
          toast.error('ログインに複数回失敗したためログインを一時的に無効にしました');
          break;
        default:
          toast.error('エラーが発生しました')
          break;
      }
      setIsPending(false)
    }

  }

  return { isPending, signup }
}