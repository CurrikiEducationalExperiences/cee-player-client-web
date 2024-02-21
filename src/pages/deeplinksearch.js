import React, { useState, useEffect } from 'react';
import { useSearchParams } from "react-router-dom";
import axios from 'axios';
import "./deeplinksearch.scss";
import search from '../assets/images/search.svg';

const searchUrl = `${process.env.REACT_APP_API_DOMAIN_URL}/api/v1/stream/search`;
const deeplinkUrl = process.env.REACT_APP_API_DOMAIN_URL + process.env.REACT_APP_DEEPLINK_URL;

function DeepLinkSearch() {
  const [searchParams] = useSearchParams();
  const ltik = searchParams.get("ltik");
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(searchUrl, {
        params: {
          query: searchInput,
        },
        headers: {
          Authorization: `Bearer ${ltik}`
        }
      });
      setError(null);
      setSearchResults(response.data.result);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Error fetching results');
    }
  };

  const handleSelect = (id, title) => {
    const requestOptions = {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ltik}`
      },
      body: JSON.stringify({ id, title}),
    };
    fetch(deeplinkUrl, requestOptions)
      .then((response) => response.text())
      .then((form) => {
        document
          .querySelector("body")
          .insertAdjacentHTML(
            "beforeend",
            form
          );

        setTimeout(() => {
          document
            .getElementById("ltijs_submit")
            ?.submit();
        }, [1500]);
      })
      .catch((error) =>
        console.error("Error:", error)
      );
  };

  return (
    <div className='dlsearchcontainer'>
      <div className='search-container'>
        <input
          type="text"
          placeholder="Search C2E Titles..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          className='search-input'
        />
        <span class="search-icon" onClick={handleSearch}>
          <img src={search} alt='search icon'/>
        </span>
      </div>
      {error && (<p className='error'>{error}</p>)}
      <div>
        {searchResults.map((result) => (
          <div key={result.subscriptionId} onClick={() => { handleSelect(result.subscriptionId, result.name); }} className='search-result'>
            <h1 className='search-result-title'>{result.name}</h1>
            <p className='search-result-description'>{result.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DeepLinkSearch;
