import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import parse from "html-react-parser";

const TafsirSurat = () => {
  const { id } = useParams();
  const [tafsir, setTafsir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [surat, setSurat] = useState(null);

  useEffect(() => {
    // Fetch data tafsir
    const fetchTafsir = async () => {
      try {
        setLoading(true);
        
        // Fetch info surat
        const suratResponse = await fetch(`https://equran.id/api/v2/surat/${id}`);
        const suratData = await suratResponse.json();
        setSurat(suratData.data);
        
        // Fetch tafsir
        const tafsirResponse = await fetch(`https://equran.id/api/v2/tafsir/${id}`);
        const tafsirData = await tafsirResponse.json();
        setTafsir(tafsirData.data);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTafsir();
  }, [id]);

  if (loading) return <div className="text-center my-4">Memuat tafsir...</div>;
  if (!tafsir || !surat) return <div className="text-center my-4">Data tafsir tidak ditemukan</div>;

  return (
    <div className="container py-4">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title">
            Tafsir Surat {surat.namaLatin} ({surat.nama})
          </h2>
          <p className="text-muted">Jumlah Ayat: {surat.jumlahAyat}</p>
          
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to={`/surat/${id}`} className="btn btn-outline-primary">
              <i className="bi bi-arrow-left"></i> Kembali ke Surat
            </Link>
          </div>
        </div>
      </div>

      <div className="list-group">
        {tafsir.tafsir.map((item, index) => (
          <div key={index} className="list-group-item mb-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <h5 className="mb-1">Tafsir Ayat {item.ayat}</h5>
              <span className="badge bg-primary rounded-pill">{item.ayat}</span>
            </div>
            
            <div className="mt-3">
              <h6>Teks Tafsir:</h6>
              <div className="p-3 bg-light rounded">
                {parse(item.teks)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TafsirSurat;