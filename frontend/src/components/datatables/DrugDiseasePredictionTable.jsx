import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import '../css/datatables.min.css';
import 'datatables.net-dt';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const fetchAllPagesConcurrently = async (url, totalPages) => {
  const token = getAuthToken();
  const requests = [];
  for (let page = 1; page <= totalPages; page++) {
    requests.push(axios.get(`${url}&page=${page}`, {
      headers: {
        Authorization: `Token ${token}`
      }
    }));
  }
  const responses = await Promise.all(requests);
  const results = responses.flatMap(response => response.data.results);
  return results;
};

const fetchDiseaseProbability = async (drugName) => {
  const initialUrl = `/api/drug-diseases-probability/?search=${drugName}`;
  const totalPages = 7; // Specify the total number of pages
  return fetchAllPagesConcurrently(initialUrl, totalPages);
};

const DrugDiseasePredictionTable = ({ drugName }) => {
  const [diseaseData, setDiseaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = getAuthToken();

  useEffect(() => {
    if (!token) return;

    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDiseaseProbability(drugName);
        if (isMounted) {
          setDiseaseData(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (drugName) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [drugName, token]);

  useEffect(() => {
    if (diseaseData && diseaseData.length > 0) {
      const formattedData = diseaseData.map(item => ({
        ...item,
        prediction: item.prediction.toFixed(3),
        compound_prediction: item.compound_prediction.toFixed(3),
        disease_prediction: item.disease_prediction.toFixed(3),
        disease_name_link: `<a href="/repurposing/${drugName}/${item.disease_name}" class="text-blue-500">${item.disease_name}</a>`
      }));

      $('#drugDiseasePredictionTable').DataTable({
        destroy: true,
        data: formattedData,
        columns: [
          { data: 'disease_name_link', title: 'Disease Name' },
          { data: 'prediction', title: 'Prediction' },
          { data: 'compound_prediction', title: 'Compound Prediction' },
          { data: 'disease_prediction', title: 'Disease Prediction' },
          { data: 'category', title: 'Category' },
          { data: 'trial_count', title: 'Trial Count' },
        ],
        paging: true,
        pageLength: 5,
        lengthChange: true,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      });
    }
  }, [diseaseData]);

  if (!token) {
    return <p className="text">Log in to inspect drug repurposing details</p>;
  }

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="overflow-x-auto">
      <table id="drugDiseasePredictionTable" className="min-w-full bg-white border border-gray-200 display">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Disease Name</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Prediction</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Compound Prediction</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Disease Prediction</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Category</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Trial Count</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default DrugDiseasePredictionTable;
