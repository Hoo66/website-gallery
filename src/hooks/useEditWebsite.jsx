import { useState } from "react";
import { auth, db } from "../firebase/config";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


export const useEditWebsite = () => {
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const editWebsite = async (
    {
      title, 
      websiteUrl, 
      description, 
      selectedTechs, 
      otherTech1, 
      otherTech2, 
      otherTech3
    }, 
    imageUrl, 
    imageFileName, 
    id) => {
    setIsPending(true)

    try {

      const updatedWebsite = {
        title,
        websiteUrl,
        description,
        techs: [otherTech1, otherTech2, otherTech3, ...selectedTechs],
        imageUrl,
        imageFileName,
        creator: auth.currentUser.uid,
        updatedAt: serverTimestamp() 
      }
      
      await updateDoc(doc(db, 'websites', id), updatedWebsite)

      setIsPending(false)
      navigate('/')
    } catch(error) {
      toast.error('エラーが発生しました')
      setIsPending(false)
    }

  }

  return { isPending, editWebsite }
}