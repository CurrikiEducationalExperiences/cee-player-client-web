import React, {useEffect, useState} from 'react';
import { useSearchParams } from "react-router-dom";
import logo from '../assets/images/c2elogo.svg';
import "./streamingplayerstyle.scss";

const streamManifestUrl = `${process.env.REACT_APP_API_DOMAIN_URL}/api/v1/stream/manifest`;
const streamTokenUrl = `${process.env.REACT_APP_API_DOMAIN_URL}/api/v1/stream/token`;

function StreamingPlayer(props) {
  const [searchParams] = useSearchParams();
  const subId = searchParams.get("subid");
  const ltik = searchParams.get("ltik");
  const [c2eManifest, setC2eManifest] = useState(null);
  const [streamSessionToken, setStreamSessionToken] = useState(null);
  const  [streamSessionTokenExpiresAt, setStreamSessionTokenExpiresAt] = useState(null);
  const [streamContentUrl, setStreamContentUrl] = useState(null);
  const [error, setError] = useState(null);

  // Initial load: get c2e manifest
  useEffect(() => {
    if (!subId || !ltik) {
      setError('Missing subscription or LTI params');
      return;
    };

    fetch(
      `${streamManifestUrl}?subid=${subId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ltik}`,
        },
      }
    ).then(async (response) => {
      const result = await response.json();
      if (response.status !== 200) {
        console.log(result);

        if (result.message)
          setError(`Failed to retrieve manifest: ${result.message}`);
        else
          setError('Failed to retrieve manifest');

        return;
      }
      setC2eManifest(result.result.manifest);
    }).catch((e) => {
      console.log(e);

      if (e.message)
        setError(`Failed to retrieve manifest: ${e.message}`);
      else
        setError('Failed to retrieve manifest');
    });
  }, [subId, ltik]);

  // Got manifest, start streaming session
  useEffect(() => {
    if (!ltik || !subId || !c2eManifest) return;

    fetch(
      `${streamTokenUrl}?subid=${subId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ltik}`,
        },
      }
    ).then( async(response) => {
      const result = await response.json();
      if (response.status !== 200) {
        console.log('Error: ', result);
        if (result.message)
          setError(`Failed to retrieve token: ${result.message}`);
        else
          setError('Failed to retrieve token');
        return;
      }
      setStreamSessionToken(result.result.token);
      setStreamSessionTokenExpiresAt(result.result.expiresAt);
      setStreamContentUrl(`${c2eManifest.c2eWorkflow[0].url}&token=${result.result.token}`);
    }).catch((e) => {
      console.log(e);

      if (e.message)
        setError(`Failed to retrieve token: ${e.message}`);
      else
        setError('Failed to retrieve token');
    });
  }, [ltik, subId, c2eManifest]);

  return (
    <div>
      {!c2eManifest && !error && (
        <div className='loading'>
          <img src={logo} alt="Curriki Educational Experiences logo" />
          <p>Loading...</p>
        </div>
      )}
      {error && (
        <div className='loading'>
          <img src={logo} alt="Curriki Educational Experiences logo" />
          <p className='error'>Error: {error}</p>
        </div>
      )}
      {streamContentUrl && (
        <iframe src={streamContentUrl} style={{height:'95vh', width: '100%'}} title="C2E Content"></iframe>
      )}
    </div>
  );
}

export default StreamingPlayer;
