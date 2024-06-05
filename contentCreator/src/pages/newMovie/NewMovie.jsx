import { useContext, useState } from "react";
import "./newMovie.css";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
import { createMovie } from "../../context/movieContext/apiCalls";
import { MovieContext } from "../../context/movieContext/MovieContext";
import CircularProgress from "@mui/material/CircularProgress";

export default function NewMovie() {
  const [movie, setMovie] = useState(null);
  const [img, setImg] = useState(null);
  const [imgTitle, setImgTitle] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [trailer, setTrailer] = useState(null);
  const [video, setVideo] = useState(null);
  const [uploaded, setUploaded] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileNames, setFileNames] = useState({
    img: "",
    imgTitle: "",
    thumbnail: "",
    trailer: "",
    video: "",
  });

  const { dispatch } = useContext(MovieContext);

  const handleChange = (e) => {
    const value = e.target.value;
    setMovie({ ...movie, [e.target.name]: value });
  };

  const handleFileChange = (e, label) => {
    const file = e.target.files[0];
    if (file) {
      switch (label) {
        case "img":
          setImg(file);
          break;
        case "imgTitle":
          setImgTitle(file);
          break;
        case "thumbnail":
          setThumbnail(file);
          break;
        case "trailer":
          setTrailer(file);
          break;
        case "video":
          setVideo(file);
          break;
        default:
          break;
      }
      setFileNames((prev) => ({ ...prev, [label]: file.name }));
    }
  };

  const upload = (items) => {
    items.forEach((item) => {
      const fileName = new Date().getTime() + item.label + item.file.name;
      const storageRef = ref(storage, `movies/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, item.file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);

          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            setMovie((prev) => {
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
      { file: img, label: "img" },
      { file: imgTitle, label: "imgTitle" },
      { file: thumbnail, label: "thumbnail" },
      { file: trailer, label: "trailer" },
      { file: video, label: "video" },
    ]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMovie(movie, dispatch);
  };

  return (
    <div className="newMovie">
      <h1 className="addMovieTitle">New Movie</h1>
      <form className="addMovieForm">
        {[
          { label: "Image", name: "img", state: setImg },
          { label: "Title image", name: "imgTitle", state: setImgTitle },
          { label: "Thumbnail image", name: "thumbnail", state: setThumbnail },
          { label: "Trailer", name: "trailer", state: setTrailer },
          { label: "Video", name: "video", state: setVideo },
        ].map(({ label, name, state }) => (
          <div className="addMovieItem" key={name}>
            <label>{label}</label>
            <label className="upload" htmlFor={name}>
              <svg
                className="upload-icon"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              {fileNames[name] ? (
                <span>{fileNames[name]}</span>
              ) : (
                <span>Drag and drop here</span>
              )}
              <input
                type="file"
                id={name}
                name={name}
                onChange={(e) => handleFileChange(e, name)}
              />
            </label>
          </div>
        ))}
        {[
          { label: "Title", name: "title", type: "text", placeholder: "ተፈጣሪዝም" },
          { label: "Title_eng", name: "title1", type: "text", placeholder: "Tefetarism" },
          { label: "Description", name: "description", type: "text", placeholder: "description" },
          { label: "Release Date", name: "releaseDate", type: "date", placeholder: "release_date" },
          { label: "Genre", name: "genre", type: "text", placeholder: "Genre" },
          { label: "Duration", name: "duration", type: "text", placeholder: "Duration" },
          { label: "Age Limit", name: "Age", type: "text", placeholder: "" },
          { label: "Director", name: "director", type: "text", placeholder: "Director" },
          { label: "Actors", name: "actors", type: "text", placeholder: "actors" },
          { label: "Language", name: "language", type: "text", placeholder: "language" },
          { label: "Country", name: "country", type: "text", placeholder: "country" },
        ].map(({ label, name, type, placeholder }) => (
          <div className="addMovieItem" key={name}>
            <label>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              name={name}
              onChange={handleChange}
            />
          </div>
        ))}
        <div className="addMovieItem">
          <label>Is Series?</label>
          <select name="isSeries" id="isSeries" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="addMovieItem">
          <label>Is Premium?</label>
          <select name="premium" id="premium" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        {uploaded === 5 ? (
          <button className="addMovieButton" onClick={handleSubmit}>
            Create
          </button>
        ) : (
          <>
          <button className="addMovieButton" onClick={handleUpload}>
            Upload
          </button>
          <div className="progressIndicator">
          <CircularProgress variant="determinate" value={uploadProgress} />
          <span>{`${Math.round(uploadProgress)}%`}</span>
        </div>
          </>
          
        )}
      </form>
    
      
    </div>
  );
}
