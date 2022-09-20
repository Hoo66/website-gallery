import { useState } from "react";
import { auth, db } from "../firebase/config";
import { collection, serverTimestamp, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'


export const useAddWebsite = () => {
  const [isPending, setIsPending] = useState(false)
  const navigate = useNavigate()

  const addWebsite = async ({title, websiteUrl, description, selectedTechs, otherTech1, otherTech2, otherTech3}, imageUrl, imageFileName) => {
    setIsPending(true)

    try {
      const newWebsite = {
        title,
        websiteUrl,
        description,
        techs: [otherTech1, otherTech2, otherTech3, ...selectedTechs],
        imageUrl,
        imageFileName,
        creator: auth.currentUser.uid,
        timestamp: serverTimestamp() 
      }
      
      const docRef = await addDoc(collection(db, 'websites'), newWebsite)
      console.log('new website added', docRef.id)


      setIsPending(false)
      navigate('/')
    } catch(error) {
      toast.error('エラーが発生しました')
      setIsPending(false)
    }

  }

  return { isPending, addWebsite }
}