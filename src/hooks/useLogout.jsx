import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const useLogout = () => {
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const refreshPage = () => {
    window.location.reload()
  }

  const handleLogout = async () => {
    console.log('logoutボタン押された')

    setError(null)
    setIsPending(true)

    try {
      await signOut(auth)
      navigate('/')
      setError(null)
      setIsPending(false)
      toast.success('ログアウトしました')
      refreshPage()
     } catch (error) {
      toast('エラーが発生しました')
      setError(error.messaeg)
      setIsPending(false)
    }

  }
  return {isPending, error, handleLogout}
}