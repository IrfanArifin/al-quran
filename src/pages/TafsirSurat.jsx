import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TafsirSurat = () => {
  const { id } = useParams();
  const [tafsirData, setTafsirData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://equran.id/api/v2/tafsir/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setTafsirData(data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Gagal mengambil data tafsir.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Memuat tafsir...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Tafsir Surat {tafsirData.namaLatin}</h2>
      <p><strong>Jumlah Ayat:</strong> {tafsirData.jumlahAyat}</p>
      {tafsirData.tafsir.map((ayat, index) => (
        <div key={index} className="mb-3">
          <h5>Ayat {ayat.ayat}</h5>
          <p>{ayat.teks}</p>
        </div>
      ))}
    </div>
  );
};

export default TafsirSurat;
