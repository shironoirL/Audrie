import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import '../css/datatables.min.css';
import 'datatables.net-dt';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const fetchAllPagesConcurrently = async (url) => {
  const token = getAuthToken();
  const headers = token ? { Authorization: `Token ${token}` } : {};
  const firstPageResponse = await axios.get(url, { headers });
  const totalPages = Math.ceil(firstPageResponse.data.count / firstPageResponse.data.results.length);
  const requests = [];
  for (let page = 1; page <= totalPages; page++) {
    requests.push(axios.get(`${url}&page=${page}`, { headers }));
  }
  const responses = await Promise.all(requests);
  const results = responses.flatMap(response => response.data.results);
  return results;
};

const fetchMechanisms = async (drugName) => {
  const initialUrl = `/api/mechanism-of-action/?search=${drugName}`;
  return fetchAllPagesConcurrently(initialUrl);
};

const MechanismTable = ({ drugName }) => {
  const [mechanismData, setMechanismData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchMechanisms(drugName);
        if (isMounted) {
          setMechanismData(data);
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
  }, [drugName]);

  useEffect(() => {
    if (mechanismData && mechanismData.length > 0) {
      $('#mechanismTable').DataTable({
        destroy: true,
        data: mechanismData,
        columns: [
          { data: 'action_type', title: 'Action Type' },
          { data: 'mechanism_of_action', title: 'Mechanism of Action' },
          { data: 'target_name', title: 'Target Name' },
          { data: 'target_type', title: 'Target Type' },
        ],
        paging: true,
        pageLength: 5,
        lengthChange: true,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      });
    }
  }, [mechanismData]);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="overflow-x-auto">
      <table id="mechanismTable" className="min-w-full bg-white border border-gray-200 display">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Action Type</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Mechanism of Action</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Target Name</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Target Type</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default MechanismTable;
