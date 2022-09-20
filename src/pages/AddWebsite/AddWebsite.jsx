import { useState } from "react"
import { storage } from "../../firebase/config"
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { v4 as uuid } from 'uuid'
import { useAddWebsite } from "../../hooks/useAddWebsite"
import './AddWebsite.scss'


export const AddWebsite = () => {
  const { isPending, addWebsite } = useAddWebsite()
  const [showAddButton, setShowAddButton] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    websiteUrl: '',
    description: '',
    selectedTechs: [],
    otherTech1: '',
    otherTech2: '',
    otherTech3: '',
  })
  const { title, websiteUrl, description, selectedTechs, otherTech1, otherTech2, otherTech3} = formData
  const [imageFile, setImageFile] = useState(null)
  const imageFileName = `${uuid()}`

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
      await setShowAddButton(false)
    } else {
      alertSpace.textContent = ''
      setImageFile(imagefile)
      const imageURL = await load(imagefile)
      document.getElementById('img').src = imageURL
      setShowAddButton(true)
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

    let downloadURL = 'downloadURL';
    const storeImage = (imageFile) => {
      return new Promise (async (resolve, reject) => {
        const storageRef = ref(storage, 'images/' + imageFileName)
        const uploadTask = await uploadBytesResumable(storageRef, imageFile)
        downloadURL = await getDownloadURL(uploadTask.ref)
        resolve(downloadURL)
      })
    }
    
    storeImage(imageFile)
      .then(downloadURL => {
        let imageUrl = downloadURL
        addWebsite(formData, imageUrl, imageFileName)
      })
      
  }


  return (
    <div className="add-website">
      <h2>Add a New Website</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <label htmlFor="title">Webサイトのタイトル: </label>
          <input 
            type="text" 
            id="title"
            name="title" 
            value={title} 
            maxLength="20"
            minLength={5} 
            required
            onChange={handleChange}
          />

        <label>URL:</label>
          <input 
            type="url" 
            id="websiteUrl"
            value={websiteUrl}
            maxLength="50"
            name="websiteUrl" 
            onChange={handleChange}
            required 
          />
        

        <label>使用した言語・ツール(複数選択可能):</label>
          <div className="selectedTechs">
            <select 
              id="selectedTechs" 
              name="techs" 
              multiple 
              size="5" 
              onChange={handleSelect} 
              required
            >
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="React">React</option>
              <option value="Vue">Vue</option>
              <option value="Ruby">Ruby</option>
              <option value="Ruby on Rails">Ruby on Rails</option>
              <option value="Firebase">Firebase</option>
              <option value="Python">Python</option>
              <option value="PHP">PHP</option>
              <option value="MongoDB">MongoDB</option>
            </select>
          </div>
        

          <span>上記選択しにない場合は以下にご記入ください。</span>
          <small>(3つまで。それ以上はDescriptionに記載ください)</small>
          <input 
            type="text" 
            id="otherTech1" 
            name="otherTech1" 
            value={otherTech1} 
            placeholder="その他1" 
            onChange={handleChange}
          />
          <input 
            type="text" 
            id="otherTech2" 
            name="otherTech2" 
            value={otherTech2} 
            placeholder="その他2" 
            onChange={handleChange}
          />
          <input 
            type="text" 
            id="otherTech3" 
            name="otherTech3" 
            value={otherTech3} 
            placeholder="その他3" 
            onChange={handleChange}
          />

        <label>説明（400字まで）:</label>
          <textarea 
            id="description"
            value={description} 
            maxLength="2000"
            name="description" 
            cols="30" 
            rows="10" 
            required
            onChange={handleChange}
          ></textarea>
        

        <label>画像(2MBまで):</label>
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/jpg" 
            name="image"
            required
            onChange={handleImageChange}
          />
          <div className="alert-space"></div>
          <div className="form-img-preview">
            <img id="img" alt="" />
          </div>

          {!isPending  && <button disabled={showAddButton ? false : true}>Add</button>}
          {isPending  && <button disabled style={{borderColor: '#eee', color: '#ccc'}}>Adding...</button>}
   


      </form>
    </div>
  )
}