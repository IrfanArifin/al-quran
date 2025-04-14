import Navbar from "./components/Navbar";
import Content from "./components/Content";
import { HashRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DetailSurat from "./pages/DetailSurat";
// export komponen about
import About from "./components/About"; 
import TafsirSurat from "./pages/TafsirSurat";

function App() {
  return (
    <div className="d-flex row">
      <HashRouter> 
        <div className="col-3">
          <Navbar />
        </div>
        <div className="col-9">
          <Content>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/surat/:id" element={<DetailSurat />} />
              {/* menambahkan routes untuk halaman About */}
              <Route path="/about" element={<About />} />
              <Route path="/tafsir/:id" element={<TafsirSurat />} />
            </Routes>
          </Content>
        </div>
      </HashRouter>
    </div>
  );
}

export default App;