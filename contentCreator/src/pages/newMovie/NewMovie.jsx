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
  const [uploadProgress, setUploadProgress] = useState(0); // State for upload progress

  const { dispatch } = useContext(MovieContext);

  const handleChange = (e) => {
    const value = e.target.value;
    setMovie({ ...movie, [e.target.name]: value });
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
          setUploadProgress(progress); // Update upload progress

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
            setUploaded((prev) => prev + 1); // Update uploaded count
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
  console.log(movie);

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Movie</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={(e) => setImg(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title image</label>
          <input
            type="file"
            id="imgTitle"
            name="imgTitle"
            onChange={(e) => setImgTitle(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Thumbnail image</label>
          <input
            type="file"
            id="imgSm"
            name="thumbnail"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            type="text"
            placeholder="ተፈጣሪዝም"
            name="title"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Title_eng</label>
          <input
            type="text"
            placeholder="Tefetarism"
            name="title1"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="description"
            name="description"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Release Date</label>
          <input
            type="date"
            placeholder="release_date"
            name="releaseDate"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Duration</label>
          <input
            type="text"
            placeholder="Duration"
            name="duration"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Age Limit</label>
          <input
            type="text"
            placeholder=""
            name="Age"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Director</label>
          <input
            type="text"
            placeholder="Director"
            name="director"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Actors</label>
          <input
            type="text"
            placeholder="actors"
            name="actors"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Language</label>
          <input
            type="text"
            placeholder="language"
            name="language"
            onChange={handleChange}
          />
        </div>
        {/* <div className="addProductItem">
          <label>Rating</label>
          <input
            type="text"
            placeholder="rating"
            name="rating"
            onChange={handleChange}
          />
        </div> */}
        <div className="addProductItem">
          <label>Country</label>
          <input
            type="text"
            placeholder="country"
            name="country"
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Is Series?</label>
          <select name="isSeries" id="isSeries" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Is Premium?</label>
          <select name="premium" id="premium" onChange={handleChange}>
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Trailer</label>
          <input
            type="file"
            name="trailer"
            onChange={(e) => setTrailer(e.target.files[0])}
          />
        </div>
        <div className="addProductItem">
          <label>Video</label>
          <input
            type="file"
            name="video"
            onChange={(e) => setVideo(e.target.files[0])}
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
      )}{" "}
    </div>
  );
}
