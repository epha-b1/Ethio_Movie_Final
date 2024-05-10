import { useContext, useState } from "react";
import "./newSerious.css";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import { createSerious } from "../../context/seriesContext/apiCalls";
import { SeriousContext } from "../../context/seriesContext/SeriousContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function NewSerious() {
  const [Series, setSeries] = useState({
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
  const { dispatch } = useContext(SeriousContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeries({ ...Series, [name]: value });
  };

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    setSeries({ ...Series, [label]: file });
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
            setSeries((prev) => {
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
      { file: Series.img, label: "img" },
      { file: Series.imgTitle, label: "imgTitle" },
      { file: Series.imgSm, label: "imgSm" },
      { file: Series.trailer, label: "trailer" },
      { file: Series.video, label: "video" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createSerious(Series, dispatch);
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
            value={Series.title}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={Series.description}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Year</label>
          <input
            type="text"
            placeholder="Year"
            name="year"
            value={Series.year}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            value={Series.genre}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Language</label>
          <input
            type="text"
            placeholder="Language"
            name="language"
            value={Series.language}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Country</label>
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={Series.country}
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
        {uploaded === 5 ? (
          <button className="addProductButton" onClick={handleSubmit}>
            Create
          </button>
        ) : (
          <button className="addProductButton" onClick={handleUpload}>
            Upload
          </button>
        )}
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
