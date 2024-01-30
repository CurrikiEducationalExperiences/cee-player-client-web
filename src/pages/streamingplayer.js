import React, {useEffect, useState} from 'react';
import { useSearchParams } from "react-router-dom";
const streamUrl = process.env.REACT_APP_API_DOMAIN_URL + process.env.REACT_APP_STREAM_URL;
const streamContentUrl = process.env.REACT_APP_API_DOMAIN_URL + process.env.REACT_APP_STREAM_CONTENT_URL;

function StreamingPlayer(props) {
  const [searchParams] = useSearchParams();
  const c2eId = searchParams.get("c2eId");
  const ltik = searchParams.get("ltik");
  const [c2eManifest, setC2eManifest] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!c2eId || !ltik) return;

    fetch(
      `${streamUrl}?ceeId=${c2eId}`,
      {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ltik}`,
        },
      }
    ).then((response) => {
      setC2eManifest(response);
    }).catch((e) => {
      console.log(e);
      setError('Failed to retrieve manifest');
    });
  }, [c2eId, ltik]);

  return (
    <div>
      <h1>Test Streaming player</h1>
      {!c2eManifest && !error && (
        <p>Loading...</p>
      )}
      {error && (
        <p>Error: {error}</p>
      )}
      {c2eManifest && (
        <iframe src={streamContentUrl} width="100%" height="100%" title="C2E Content"></iframe>
      )}
    </div>
  );
}

export default StreamingPlayer;
