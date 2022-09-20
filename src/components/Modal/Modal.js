import './Modal.scss'

export const Modal = ({ confirmation, closeModal, confirmationButtonText, execute }) => {
  return (
    <div className="modal">
      <div className="modal-container">
        <button className='close-button' onClick={closeModal}> X </button>
        <div className="title">
          <h3>{confirmation}</h3>
        </div>
        <div className="answer">
          <button className='cancel-button' onClick={closeModal}>Cancel</button>
          <button onClick={execute}>{confirmationButtonText}</button>
        </div>
      </div>
    </div>
  )
}