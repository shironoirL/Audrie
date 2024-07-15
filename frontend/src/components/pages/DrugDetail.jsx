import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';
import DrugInfo from './DrugInfo';
import DrugDiseasePredictionTable from '../datatables/DrugDiseasePredictionTable';
import IndicationTable from '../datatables/IndicationTable';
import MechanismTable from '../datatables/MechanismTable';

const DrugDetail = () => {
  const { drugName } = useParams();
  const { authState } = useAuth();
  const { email } = authState;
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const savedDrugs = JSON.parse(localStorage.getItem(email)) || [];
    setIsSaved(savedDrugs.includes(drugName));
  }, [drugName, email]);

  const handleSave = () => {
    const savedDrugs = JSON.parse(localStorage.getItem(email)) || [];
    if (isSaved) {
      const newSavedDrugs = savedDrugs.filter(name => name !== drugName);
      localStorage.setItem(email, JSON.stringify(newSavedDrugs));
    } else {
      savedDrugs.push(drugName);
      localStorage.setItem(email, JSON.stringify(savedDrugs));
    }
    setIsSaved(!isSaved);
  };

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">{drugName}</h1>
      <button
        onClick={handleSave}
        className={`${
          isSaved ? 'bg-red-500' : 'bg-green-500'
        } text-white font-bold py-2 px-4 rounded`}
      >
        {isSaved ? 'Unsave' : 'Save'}
      </button>
      <DrugInfo drugName={drugName} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Disease Prediction</h2>
      <DrugDiseasePredictionTable drugName={drugName} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Indications</h2>
      <IndicationTable drugName={drugName} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Mechanism of Action</h2>
      <MechanismTable drugName={drugName} />
    </div>
  );
};

export default DrugDetail;
