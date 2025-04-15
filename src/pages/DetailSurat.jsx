import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import parse from "html-react-parser";
import AudioPlayer from "../components/AudioPlayer";

const DetailSurat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [surat, setSurat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentSuratAudio, setCurrentSuratAudio] = useState(null);

  const getDetailSurat = async (idSurat) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`https://equran.id/api/v2/surat/${idSurat}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSurat(data.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Gagal memuat data surat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDetailSurat(id);
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Memuat...</span>
        </div>
        <p className="mt-2">Memuat data surat...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mx-3 my-5">
        <h4>Terjadi Kesalahan</h4>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-primary"
        >
          Coba Lagi
        </button>
        <button 
          onClick={() => navigate("/")} 
          className="btn btn-outline-primary ms-2"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  if (!surat) {
    return (
      <div className="alert alert-warning mx-3 my-5">
        <h4>Data Tidak Ditemukan</h4>
        <p>Surat dengan ID {id} tidak ditemukan.</p>
        <button 
          onClick={() => navigate("/")} 
          className="btn btn-primary"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const suratAudioUrl = surat.audioFull?.["05"];

  return (
    <div className="vh-100 overflow-auto p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <button 
          onClick={() => navigate(-1)} 
          className="btn btn-outline-secondary"
        >
          <i className="bi bi-arrow-left"></i> Kembali
        </button>
        <Link 
          to={`/tafsir/${id}`} 
          className="btn btn-primary"
        >
          <i className="bi bi-book"></i> Lihat Tafsir
        </Link>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="card-title">
                {surat.nomor}. {surat.namaLatin} ({surat.nama})
              </h2>
              <div className="card-text">
                <p className="mb-1">Jumlah Ayat: {surat.jumlahAyat}</p>
                <p className="mb-1">Arti: {surat.arti}</p>
              </div>
            </div>
            
            {suratAudioUrl && (
              <div className="text-end">
                <p className="mb-1 small">Murotal Surat</p>
                <AudioPlayer 
                  url={suratAudioUrl}
                  currentAudio={currentSuratAudio}
                  setCurrentAudio={setCurrentSuratAudio}
                  size="lg"
                />
              </div>
            )}
          </div>
          <div className="mt-3">{parse(surat.deskripsi)}</div>
        </div>
      </div>

      <div className="list-group">
        {surat.ayat?.map((ayat) => (
          <div key={ayat.nomorAyat} className="list-group-item mb-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="arabic-text fs-3">{ayat.teksArab}</span>
              <div className="d-flex align-items-center">
                <span className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                      style={{width: '30px', height: '30px'}}>
                  {ayat.nomorAyat}
                </span>
                <AudioPlayer
                  key={ayat.nomorAyat}
                  url={ayat.audio?.["05"]}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              </div>
            </div>
            
            <div className="mt-2">
              <p className="fw-bold mb-1">Terjemahan:</p>
              <p className="text-muted">{ayat.teksIndonesia}</p>
            </div>
            
            <div className="mt-2">
              <p className="fw-bold mb-1">Latin:</p>
              <p className="fst-italic">{ayat.teksLatin}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailSurat;