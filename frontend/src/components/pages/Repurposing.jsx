import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import PathPredictionTable from '../datatables/PathPrediction';
import MetapathPredictionTable from '../datatables/MetapathPredictionTable';
import SourceEdgePredictionTable from '../datatables/SourceEdgePredictionTable';
import TargetEdgePredictionTable from '../datatables/TargetEdgePredictionTable';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const fetchDrugDiseaseDetail = async ({ queryKey }) => {
  const [_, drugName, diseaseName] = queryKey;
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(`/api/drug-diseases-probability/?search=${drugName}&disease=${diseaseName}`, { headers });
  return response.data;
};

const fetchPathPredictions = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(`/api/path-predictions/?search=${id}`, { headers });
  return response.data;
};

const fetchMetapathPredictions = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(`/api/metapath-predictions/?search=${id}`, { headers });
  return response.data;
};

const fetchSourceEdgePredictions = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(`/api/source-edge-predictions/?search=${id}`, { headers });
  return response.data;
};

const fetchTargetEdgePredictions = async ({ queryKey }) => {
  const [_, id] = queryKey;
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const response = await axios.get(`/api/target-edge-predictions/?search=${id}`, { headers });
  return response.data;
};

const Repurposing = () => {
  const { drugName, diseaseName } = useParams();
  const token = getAuthToken();

  if (!token) {
    return <p className="text-center">Log in to inspect drug repurposing details</p>;
  }

  const { data: drugDiseaseData, isLoading: isLoadingDrugDisease, error: errorDrugDisease } = useQuery({
    queryKey: ['drugDiseaseDetail', drugName, diseaseName],
    queryFn: fetchDrugDiseaseDetail,
  });

  const { data: pathPredictionData, isLoading: isLoadingPathPrediction, error: errorPathPrediction } = useQuery({
    queryKey: ['pathPredictions', drugDiseaseData?.results?.[0]?.id],
    queryFn: fetchPathPredictions,
    enabled: !!drugDiseaseData?.results?.[0]?.id, // Only fetch if we have the id
  });

  const { data: metapathPredictionData, isLoading: isLoadingMetapathPrediction, error: errorMetapathPrediction } = useQuery({
    queryKey: ['metapathPredictions', drugDiseaseData?.results?.[0]?.id],
    queryFn: fetchMetapathPredictions,
    enabled: !!drugDiseaseData?.results?.[0]?.id, // Only fetch if we have the id
  });

  const { data: sourceEdgePredictionData, isLoading: isLoadingSourceEdgePrediction, error: errorSourceEdgePrediction } = useQuery({
    queryKey: ['sourceEdgePredictions', drugDiseaseData?.results?.[0]?.id],
    queryFn: fetchSourceEdgePredictions,
    enabled: !!drugDiseaseData?.results?.[0]?.id, // Only fetch if we have the id
  });

  const { data: targetEdgePredictionData, isLoading: isLoadingTargetEdgePrediction, error: errorTargetEdgePrediction } = useQuery({
    queryKey: ['targetEdgePredictions', drugDiseaseData?.results?.[0]?.id],
    queryFn: fetchTargetEdgePredictions,
    enabled: !!drugDiseaseData?.results?.[0]?.id, // Only fetch if we have the id
  });

  if (isLoadingDrugDisease || isLoadingPathPrediction || isLoadingMetapathPrediction || isLoadingSourceEdgePrediction || isLoadingTargetEdgePrediction) return <p className="text-center">Loading...</p>;
  if (errorDrugDisease) return <p className="text-center text-red-500">Error: {errorDrugDisease.message}</p>;
  if (errorPathPrediction) return <p className="text-center text-red-500">Error: {errorPathPrediction.message}</p>;
  if (errorMetapathPrediction) return <p className="text-center text-red-500">Error: {errorMetapathPrediction.message}</p>;
  if (errorSourceEdgePrediction) return <p className="text-center text-red-500">Error: {errorSourceEdgePrediction.message}</p>;
  if (errorTargetEdgePrediction) return <p className="text-center text-red-500">Error: {errorTargetEdgePrediction.message}</p>;

  if (!drugDiseaseData || drugDiseaseData.results.length === 0) return <p className="text-center text-red-500">No data found for this combination</p>;

  const details = drugDiseaseData.results[0];

  console.log('Details received:', details); // Debugging line

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
