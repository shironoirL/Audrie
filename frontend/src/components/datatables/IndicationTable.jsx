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

const fetchIndications = async (drugName) => {
  const initialUrl = `/api/indication/?search=${drugName}`;
  return fetchAllPagesConcurrently(initialUrl);
};

const IndicationTable = ({ drugName }) => {
  const [indicationData, setIndicationData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchIndications(drugName);
        if (isMounted) {
          setIndicationData(data);
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
    if (indicationData && indicationData.length > 0) {
      $('#indicationTable').DataTable({
        destroy: true,
        data: indicationData,
        paging: true,
        pageLength: 5,
        lengthChange: true,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, 'All']],
        columns: [
          { data: 'efo_name', title: 'EFO Name' },
          { data: 'disease', title: 'Disease' },
          {
            data: 'reference_link',
            title: 'Reference Link',
            render: (data, type, row) => {
              const links = data.split(',').map(link => link.trim());
              const linkCount = links.length;
              return `
                <div class="link-wrapper">
                  <button class="toggle-button text-blue-500">Show ${linkCount} sources</button>
                  <div class="links-container" style="display: none;">
                    ${links.map(link => `<a href="${link}" target="_blank" style="color: purple;">${link}</a>`).join('<br>')}
                  </div>
                </div>
              `;
            }
          },
          { data: 'max_phase_for_indication', title: 'Max Phase' },
        ],
      });

      $('#indicationTable tbody').on('click', '.toggle-button', function (e) {
        e.preventDefault();
        const $wrapper = $(this).closest('.link-wrapper');
        const $linksContainer = $wrapper.find('.links-container');
        const isVisible = $linksContainer.is(':visible');
        $linksContainer.toggle();
        $(this).text(isVisible ? `Show ${$linksContainer.children().length} sources` : `Hide ${$linksContainer.children().length} sources`);
      });
    }
  }, [indicationData]);

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="overflow-x-auto">
      <table id="indicationTable" className="min-w-full bg-white border border-gray-200 display">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">EFO Name</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Disease</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Reference Link</th>
            <th className="py-2 px-4 border-b border-gray-200 text-left text-sm font-medium text-gray-600">Max Phase</th>
          </tr>
        </thead>
      </table>
    </div>
  );
};

export default IndicationTable;
