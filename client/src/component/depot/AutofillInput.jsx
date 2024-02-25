import React from 'react';

const AutofillInput = ({ suggestions, handleInputChange, handleOptionClick }) => {
  return (
    <div className="autofill-container">
      <input
        type="text"
        onChange={handleInputChange}
        className="form-control"
        placeholder="Enter beneficiary name"
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion) => (
            <li key={suggestion.Ben_id} onClick={() => handleOptionClick(suggestion)}>
              {suggestion.Ben_Nom}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutofillInput;
