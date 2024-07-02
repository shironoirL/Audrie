import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PathPredictionTable from '../datatables/PathPrediction';
import MetapathPredictionTable from '../datatables/MetapathPredictionTable';
import SourceEdgePredictionTable from '../datatables/SourceEdgePredictionTable';
import TargetEdgePredictionTable from '../datatables/TargetEdgePredictionTable';

const getAuthToken = () => localStorage.getItem('auth_token');

const fetchData = async (url, params) => {
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(url, { headers, params });
  return response.data;
};

const fetchDrugDiseaseDetail = async ({ queryKey }) => {
  const [, drugName, diseaseName] = queryKey;
  return fetchData('/api/drug-diseases-probability/', { search: `${drugName} ${diseaseName}` });
};

const fetchPredictions = (url) => async ({ queryKey }) => {
  const [, id] = queryKey;
  return fetchData(url, { search: id });
};

const Repurposing = () => {
  const { drugName, diseaseName } = useParams();
  const token = getAuthToken();

  if (!token) {
    return <p className="text-center">Log in to inspect drug repurposing details</p>;
  }

  const {
    data: drugDiseaseData,
    isLoading: isLoadingDrugDisease,
    error: errorDrugDisease,
  } = useQuery({
    queryKey: ['drugDiseaseDetail', drugName, diseaseName],
    queryFn: fetchDrugDiseaseDetail,
  });

  const drugDiseaseId = drugDiseaseData?.results?.[0]?.id;

  const {
    data: pathPredictionData,
    isLoading: isLoadingPathPrediction,
    error: errorPathPrediction,
  } = useQuery({
    queryKey: ['pathPredictions', drugDiseaseId],
    queryFn: fetchPredictions('/api/path-predictions/'),
    enabled: !!drugDiseaseId,
  });

  const {
    data: metapathPredictionData,
    isLoading: isLoadingMetapathPrediction,
    error: errorMetapathPrediction,
  } = useQuery({
    queryKey: ['metapathPredictions', drugDiseaseId],
    queryFn: fetchPredictions('/api/metapath-predictions/'),
    enabled: !!drugDiseaseId,
  });

  const {
    data: sourceEdgePredictionData,
    isLoading: isLoadingSourceEdgePrediction,
    error: errorSourceEdgePrediction,
  } = useQuery({
    queryKey: ['sourceEdgePredictions', drugDiseaseId],
    queryFn: fetchPredictions('/api/source-edge-predictions/'),
    enabled: !!drugDiseaseId,
  });

  const {
    data: targetEdgePredictionData,
    isLoading: isLoadingTargetEdgePrediction,
    error: errorTargetEdgePrediction,
  } = useQuery({
    queryKey: ['targetEdgePredictions', drugDiseaseId],
    queryFn: fetchPredictions('/api/target-edge-predictions/'),
    enabled: !!drugDiseaseId,
  });

  if (
    isLoadingDrugDisease ||
    isLoadingPathPrediction ||
    isLoadingMetapathPrediction ||
    isLoadingSourceEdgePrediction ||
    isLoadingTargetEdgePrediction
  ) {
    return <p className="text-center">Loading...</p>;
  }

  if (errorDrugDisease || errorPathPrediction || errorMetapathPrediction || errorSourceEdgePrediction || errorTargetEdgePrediction) {
    const error =
      errorDrugDisease ||
      errorPathPrediction ||
      errorMetapathPrediction ||
      errorSourceEdgePrediction ||
      errorTargetEdgePrediction;
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!drugDiseaseData || drugDiseaseData.results.length === 0) {
    return <p className="text-center text-red-500">No data found for this combination</p>;
  }

  const details = drugDiseaseData.results[0];

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-3xl font-bold mb-4">Drug: {drugName}</h1>
      <h2 className="text-2xl font-bold mb-4">Disease: {diseaseName}</h2>
      <div className="p-4 border rounded shadow">
        <p><strong>Prediction:</strong> {details.prediction}</p>
        <p><strong>Compound Prediction:</strong> {details.compound_prediction}</p>
        <p><strong>Disease Prediction:</strong> {details.disease_prediction}</p>
        <p><strong>Category:</strong> {details.category}</p>
        <p><strong>Trial Count:</strong> {details.trial_count}</p>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Path Predictions</h2>
      <PathPredictionTable data={pathPredictionData} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Metapath Predictions</h2>
      <MetapathPredictionTable data={metapathPredictionData} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Source Edge Predictions</h2>
      <SourceEdgePredictionTable data={sourceEdgePredictionData} />
      <h2 className="text-2xl font-bold mt-8 mb-4">Target Edge Predictions</h2>
      <TargetEdgePredictionTable data={targetEdgePredictionData} />
    </div>
  );
};

export default Repurposing;
