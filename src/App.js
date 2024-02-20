import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Player from "./pages/player";
import StreamingPlayer from "./pages/streamingplayer";
import DeepLinkSearch from "./pages/deeplinksearch";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deeplinkold" element={<Home />} />
          <Route path="/lti/deeplinkold" element={<Home />} />
          <Route path="/lti" element={<Home />} />
          <Route path="/play" element={<Player />} />
          <Route path="/lti/play" element={<Player />} />
          <Route path="/stream" element={<StreamingPlayer />} />
          <Route path="/lti/stream" element={<StreamingPlayer />} />
          <Route path="/deeplink" element={<DeepLinkSearch />} />
          <Route path="/lti/deeplink" element={<DeepLinkSearch />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
