import { Link } from 'react-router-dom';
import './SiteList.scss'

export const SiteList = ({isPending, error, data, editWebsite, confirmDelete, isEditable}) => {
  return (
    <div className='site-list'>
      {isPending && <p className='loading'>Loading...</p>}
      {error && <p className='error'>{error}</p>}
      {data && data.map(website => (
        <div className="card" key={website.id}>
          <Link to={`/details/${website.id}`}>
            <div className='img-container'>
              <img src={website.imageUrl} alt={website.title} />
            </div>
          </Link>
        {isEditable && (
          <div className="edit-buttons">
            <button className="edit" id={website.id} onClick={editWebsite}>編集</button>
            <button className="delete" id={website.id} onClick={confirmDelete}>削除</button>
          </div>
        )}  

        </div>

      ))}
    </div>
  )
}