import { useContext, useState } from "react";
import "./newSerious.css";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import { createTVSeries } from "../../context/tvSeriesContext/apiCalls";
import { TVSeriesContext } from "../../context/tvSeriesContext/TVSeriesContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function NewSerious() {
  const [tvSeries, setTVSeries] = useState({
    title: "",
    description: "",
    img: null,
    imgTitle: null,
    imgSm: null,
    trailer: null,
    video: null,
    year: "",
    genre: "",
    language: "",
    country: "",
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            episodeNumber: 1,
            title: "",
            description: "",
            duration: "",
            thumbnail: null,
            url: "",
          },
        ],
      },
    ],
  });

  const [uploaded, setUploaded] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { dispatch } = useContext(TVSeriesContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTVSeries({ ...tvSeries, [name]: value });
  };

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    setTVSeries({ ...tvSeries, [label]: file });
  };

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const storageRef = ref(storage, `tvSeries/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setTVSeries((prev) => {
              return { ...prev, [item.label]: url };
            });
            setUploaded((prev) => prev + 1);
          });
        }
      );
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    upload([
      { file: tvSeries.img, label: "img" },
      { file: tvSeries.imgTitle, label: "imgTitle" },
      { file: tvSeries.imgSm, label: "imgSm" },
      { file: tvSeries.trailer, label: "trailer" },
      { file: tvSeries.video, label: "video" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createTVSeries(tvSeries, dispatch);
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New TV Series</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={tvSeries.title}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={tvSeries.description}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input
            type="text"
            placeholder="Year"
            name="year"
            value={tvSeries.year}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            value={tvSeries.genre}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Language</label>
          <input
            type="text"
            placeholder="Language"
            name="language"
            value={tvSeries.language}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Country</label>
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={tvSeries.country}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            name="img"
            onChange={(e) => handleFileChange(e, "img")}
          />
        </div>
        <div className="addProductItem">
          <label>Title Image</label>
          <input
            type="file"
            name="imgTitle"
            onChange={(e) => handleFileChange(e, "imgTitle")}
          />
        </div>
        <div className="addProductItem">
          <label>Thumbnail Image</label>
          <input
            type="file"
            name="imgSm"
            onChange={(e) => handleFileChange(e, "imgSm")}
          />
        </div>
        <div className="addProductItem">
          <label>Trailer</label>
          <input
            type="file"
            name="trailer"
            onChange={(e) => handleFileChange(e, "trailer")}
          />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input
            type="file"
            name="video"
            onChange={(e) => handleFileChange(e, "video")}
          />
        </div>
        <button className="addProductButton" onClick={handleUpload}>
          Upload
        </button>
        <button className="addProductButton" onClick={handleSubmit}>
          Create
        </button>
      </form>
      {uploaded < 5 && (
        <div className="progressIndicator">
          <CircularProgress variant="determinate" value={uploadProgress} />
          <span>{`${Math.round(uploadProgress)}%`}</span>
        </div>
      )}
    </div>
  );
}
