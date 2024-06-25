import React from 'react';
import { useParams } from 'react-router-dom';
import DrugInfo from './DrugInfo';
import DrugDiseasePredictionTable from '../datatables/DrugDiseasePredictionTable';
import IndicationTable from '../datatables/IndicationTable';
import MechanismTable from '../datatables/MechanismTable';

const DrugDetail = () => {
  const { drugName } = useParams();

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">{drugName}</h1>
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
