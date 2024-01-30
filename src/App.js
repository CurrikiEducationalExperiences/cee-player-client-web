import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Player from "./pages/player";
import StreamingPlayer from "./pages/streamingplayer";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/deeplink" element={<Home />} />
          <Route path="/lti/deeplink" element={<Home />} />
          <Route path="/lti" element={<Home />} />
          <Route path="/play" element={<Player />} />
          <Route path="/lti/play" element={<Player />} />
          <Route path="/stream" element={<StreamingPlayer />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
