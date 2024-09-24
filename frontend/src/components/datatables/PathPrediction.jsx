import React, { useEffect } from 'react';
import $ from 'jquery';
import '../css/datatables.min.css';
import 'datatables.net-dt';

const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

const PathPredictionTable = ({ data }) => {
  const token = getAuthToken();

  useEffect(() => {
    if (!token) return;

    if (data && data.results.length > 0) {
      console.log('Data received for Path Prediction Table:', data);

      const formattedData = data.results.map(item => ({
        metapath: item.metapath || 'Unknown',
        percent_of_prediction: item.percent_of_prediction ? item.percent_of_prediction.toFixed(2) : 'N/A',
        percent_of_dwpc: item.percent_of_dwpc ? item.percent_of_dwpc.toFixed(2) : 'N/A',
        length: item.length ? item.length : 'N/A',
        verbose_path: item.verbose_path || 'Unknown',
      }));

      console.log('Formatted data for DataTables:', formattedData);

      $('#pathPredictionTable').DataTable({
        destroy: true,
        data: formattedData,
        columns: [
          { data: 'metapath', title: 'Metapath' },
          { data: 'percent_of_prediction', title: 'Percent of Prediction' },
          { data: 'percent_of_dwpc', title: 'Percent of DWPC' },
          { data: 'length', title: 'Length' },
          { data: 'verbose_path', title: 'Verbose Path' },
        ],
        paging: true,
        pageLength: 5,
        lengthChange: true,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
      });
    }
  }, [data, token]);

  if (!token) {
    return <p className="text-center">Log in to inspect drug repurposing details</p>;
  }

  if (!data || data.results.length === 0) return <p className="text-center">No path predictions available.</p>;

  return (
    <div className="overflow-x-auto">
      <table id="pathPredictionTable" className="min-w-full bg-white border border-gray-200 display">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Metapath</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Percent of Prediction</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Percent of DWPC</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Length</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Verbose Path</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default PathPredictionTable;
