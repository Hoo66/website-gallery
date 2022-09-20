import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import { db, storage } from "../../firebase/config"
import { doc, getDoc } from "firebase/firestore"
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage"
import { useEditWebsite } from "../../hooks/useEditWebsite"
import { v4 as uuid } from 'uuid'


export const EditWebsite = () => {
  const { id } = useParams()
  const [data, setData] = useState(null) 
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(false)
  const [formData, setFormData] = useState({
    title: null,
    websiteUrl: null,
    description: null,
    selectedTechs: [],
    otherTech1: null,
    otherTech2: null,
    otherTech3: null,
  })
  const [imageFile, setImageFile] = useState(null)
  const { isPending, editWebsite } = useEditWebsite()
  const [originalImageUrl, setOriginalImageUrl] = useState(null)



  useEffect(() => {
    setIsLoading(true)

    const fetchWebsite = async () => {
      try {
        const docRef = doc(db, 'websites', id)
        const docSnap = await getDoc(docRef)
        await setData(docSnap.data())
        await setFormData({
          title: docSnap.data().title,
          websiteUrl: docSnap.data().websiteUrl,
          description: docSnap.data().description,
          selectedTechs: docSnap.data().techs.slice(0, docSnap.data().techs.length),
          otherTech1: docSnap.data().techs[0],
          otherTech2: docSnap.data().techs[1],
          otherTech3: docSnap.data().techs[2],
        })
        await setOriginalImageUrl(data.imageUrl)
      } catch(error) {

      }
    } 

    fetchWebsite()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({...prev, [e.target.id]: e.target.value}))
  }

  const handleSelect = (e) => {
    const element = document.getElementById('selectedTechs')
    const selectedOptions = element.selectedOptions
    const selectedTechsArr = []
    for (let i = 0; i < selectedOptions.length; i++) {
      selectedTechsArr.push(selectedOptions[i].value)
    }
    setFormData(prev => ({...prev, selectedTechs: selectedTechsArr}))

  }

  const handleImageChange = async (e) => {
    const sizeLimit = 1024 * 1024 * 2
    const imagefile = e.target.files[0]
    const alertSpace = document.querySelector('.alert-space')

    if(!imagefile) return

    if(imagefile.size > sizeLimit) {
      alertSpace.textContent = 'ファイルサイズは2MB以下にしてください'
    } else {
      alertSpace.textContent = ''
      setImageFile(imagefile)
      const imageURL = await load(imagefile)
      document.getElementById('img').src = imageURL
    }

  }

  const load = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      
      reader.onload = (event) => {
        resolve(event.target.result)
      }
      
      reader.readAsDataURL(file)
    })
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageFileName

    if(imageFile) {
      imageFileName = `${uuid()}`
      let downloadURL = ''
      const storeImage = (imageFile) => {
        return new Promise (async (resolve, reject) => {
          const storageRef = ref(storage, 'images/' + imageFileName)
          const uploadTask = await uploadBytesResumable(storageRef, imageFile)
          downloadURL = await getDownloadURL(uploadTask.ref)

          const oldImageRef = ref(storage, 'images/' + data.imageFileName)
          await deleteObject(oldImageRef)
          resolve(downloadURL)
        })
      }
      
      storeImage(imageFile)
        .then(() => {
          let imageUrl = downloadURL
          editWebsite(formData, imageUrl, imageFileName, id)
        })

    } else {
      let imageUrl = data.imageUrl
      imageFileName = data.imageFileName
      editWebsite(formData, imageUrl, imageFileName, id)
    }
      
  }

  return (
    <div className="add-website">
      <h2>Edit Website</h2>
      {data && (

      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="title">Website Title: </label>
          <input 
            type="text" 
            id="title"
            name="title" 
            defaultValue={data && data.title} 
            maxLength="20"
            minLength={5} 
            required
            onChange={handleChange}
          />

        <label>URL:</label>
          <input 
            type="url" 
            id="websiteUrl"
            defaultValue={data && data.websiteUrl} 
            name="websiteUrl" 
            onChange={handleChange}
            required 
          />
        

        <label>Applied Techs(複数選択可能):</label>
          <div className="selectedTechs">
            <select 
              id="selectedTechs" 
              name="techs" 
              multiple 
              size="5" 
              onChange={handleSelect} 
              required
            >
              <option value="JavaScript" selected={data.techs.includes("JavaScript")}>JavaScript</option>
              <option value="TypeScript" selected={data.techs.includes("TypeScript")}>TypeScript</option>
              <option value="React" selected={data.techs.includes("React")}>React</option>
              <option value="Vue" selected={data.techs.includes("Vue")}>Vue</option>
              <option value="Ruby" selected={data.techs.includes("Ruby")}>Ruby</option>
              <option value="Ruby on Rails" selected={data.techs.includes("Ruby on Rails")}>Ruby on Rails</option>
              <option value="Firebase" selected={data.techs.includes("Firebase")}>Firebase</option>
              <option value="Python" selected={data.techs.includes("Python")}>Python</option>
              <option value="PHP" selected={data.techs.includes("PHP")}>PHP</option>
              <option value="MongoDB" selected={data.techs.includes("MongoDB")}>MongoDB</option>
              <option value="other" selected={data.techs.includes("other")}>その他</option>
            </select>
          </div>
        

          <span>その他を選択した場合は具体的にご記入ください。</span>
          <small>(3つまで。それ以上はDescriptionに記載ください)</small>
          <input 
            type="text" 
            id="otherTech1" 
            name="otherTech1" 
            defaultValue={data && data.techs[0]} 
            placeholder="その他1" 
            onChange={handleChange}
          />
          <input 
            type="text" 
            id="otherTech2" 
            name="otherTech2" 
            defaultValue={data && data.techs[1]} 
            placeholder="その他2" 
            onChange={handleChange}
          />
          <input 
            type="text" 
            id="otherTech3" 
            name="otherTech3" 
            defaultValue={data && data.techs[2]} 
            placeholder="その他3" 
            onChange={handleChange}
          />

        <label>Description:</label>
          <textarea 
            id="description"
            defaultValue={data && data.description} 
            name="description" 
            cols="30" 
            rows="10" 
            required
            onChange={handleChange}
          ></textarea>
        

        <label>Upload Image(2MBまで):</label>
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/jpg" 
            name="image"
            onChange={handleImageChange}
          />
          <div className="alert-space"></div>
          <div className="form-img-preview">
          <img src={data && data.imageUrl} id="img" alt="" />
          </div>
        
        {!isPending && <button>編集内容を送信</button>}
        {isPending && <button disabled style={{borderColor: '#eee', color: '#ccc'}}>Editing...</button>}


      </form>
      )
      }
    </div>
  )
}