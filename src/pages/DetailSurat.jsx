import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import parse from "html-react-parser";
import AudioPlayer from "../components/AudioPlayer";

const DetailSurat = () => {
  const { id } = useParams();
  const [surat, setSurat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentSuratAudio, setCurrentSuratAudio] = useState(null);

  const getDetailSurat = (idSurat) => {
    fetch(`https://equran.id/api/v2/surat/${idSurat}`)
      .then((res) => res.json())
      .then((data) => {
        setSurat(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    getDetailSurat(id);
  }, [id]);

  if (loading) return <div className="text-center mt-4">Memuat surat...</div>;
  if (!surat)
    return <div className="text-center mt-4">Surat tidak ditemukan.</div>;

  // memilih salah satu qori (misal: Misyari Rasyid Al-Afasi - 05)
  const suratAudioUrl = surat.audioFull?.["05"];

  return (
    <div className="vh-100 overflow-auto p-3">
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
            {/*menambahkan murotal surat */}
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
        {surat.ayat.map((ayat) => (
          <div key={ayat.nomorAyat} className="list-group-item mb-3">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <span className="arabic-text fs-3">{ayat.teksArab}</span>
              <div className="d-flex align-items-center">
                <span
                  className="badge bg-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: "30px", height: "30px" }}
                >
                  {ayat.nomorAyat}
                </span>
                <AudioPlayer
                  key={ayat.nomorAyat}
                  url={ayat.audio["05"]}
                  currentAudio={currentAudio}
                  setCurrentAudio={setCurrentAudio}
                />
              </div>
            </div>
            {/* menambahkan terjemahan */}
            <div className="mt-2">
              <p className="fw-bold mb-1">Terjemahan:</p>
              <p className="text-muted">{ayat.teksIndonesia}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailSurat;
