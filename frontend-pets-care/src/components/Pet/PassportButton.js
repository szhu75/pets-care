import React, { useState } from 'react';
import PetPassport from './PetPassport';
import '../../styles/PassportButton.css';

const PassportButton = ({ petId }) => {
  const [showPassport, setShowPassport] = useState(false);

  const handleShowPassport = () => {
    setShowPassport(true);
  };

  const handleClosePassport = () => {
    setShowPassport(false);
  };

  return (
    <>
      <button 
        onClick={handleShowPassport} 
        className="passport-button"
        title="Voir le passeport santé"
      >
        <i className="fas fa-passport"></i> Passeport
      </button>

      {showPassport && (
        <div className="passport-modal">
          <div className="passport-modal-backdrop" onClick={handleClosePassport}></div>
          <div className="passport-modal-content">
            <PetPassport petId={petId} onClose={handleClosePassport} />
          </div>
        </div>
      )}
    </>
  );
};

export default PassportButton;