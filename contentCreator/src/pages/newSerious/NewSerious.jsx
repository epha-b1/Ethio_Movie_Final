import React, {  useState } from "react";
import "./newSerious.css";
import { storage } from "../../firebase";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";
// import { SeriousContext } from "../../context/seriesContext/SeriousContext";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import {  toast } from "sonner";

export default function NewSerious() {
  const [series, setSeries] = useState({
    title: "",
    description: "",
    thumbnail: "",
    rating: 0,
    genre: [],
    language: "",
    country: "",
    seasons: [],
  });

  const [uploaded, setUploaded] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  // const { dispatch } = useContext(SeriousContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSeries({ ...series, [name]: value });
  };

  const handleFileChange = (e, label, seasonIndex, episodeIndex) => {
    const file = e.target.files[0];
    setSeries((prevSeries) => {
      const updatedSeasons = [...prevSeries.seasons];
      updatedSeasons[seasonIndex].episodes[episodeIndex][label] = file;
      return { ...prevSeries, seasons: updatedSeasons };
    });
  };

  const addSeason = () => {
    setSeries((prevSeries) => ({
      ...prevSeries,
      seasons: [
        ...prevSeries.seasons,
        {
          seasonNumber: prevSeries.seasons.length + 1,
          episodes: [],
        },
      ],
    }));
  };

  const addEpisode = (seasonIndex) => {
    setSeries((prevSeries) => {
      const updatedSeasons = [...prevSeries.seasons];
      const newEpisode = {
        episodeNumber: updatedSeasons[seasonIndex].episodes.length + 1,
        title: "",
        description: "",
        duration: "",
        thumbnail: null,
        url: "",
      };
      updatedSeasons[seasonIndex] = {
        ...updatedSeasons[seasonIndex],
        episodes: [...updatedSeasons[seasonIndex].episodes, newEpisode],
      };
      return { ...prevSeries, seasons: updatedSeasons };
    });
  };

  const upload = (file, label, seasonIndex, episodeIndex) => {
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, `tvSeries/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setSeries((prev) => {
            const updatedSeasons = [...prev.seasons];
            updatedSeasons[seasonIndex].episodes[episodeIndex][label] = url;
            return { ...prev, seasons: updatedSeasons };
          });
          setUploaded((prev) => prev + 1);
        });
      }
    );
  };

  const handleUpload = (e, label, seasonIndex, episodeIndex) => {
    e.preventDefault();
    const file = series.seasons[seasonIndex].episodes[episodeIndex][label];
    upload(file, label, seasonIndex, episodeIndex);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
      try {
         await axios.post("http://localhost:8800/api/serious",series, {
          headers: {
            token:
              "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
          },
        });

        toast.success("Series added successful!");

      } catch (error) {
        console.error("Error serious adding:", error);
        toast.error("Series added error!");

      }
    
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
            value={series.title}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={series.description}
            onChange={handleChange}
          />
        </div>
        {/* <div className="addProductItem">
          <label>Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            onChange={(e) => handleFileChange(e, "thumbnail")}
          />
        </div> */}
        <div className="addProductItem">
          <label>Rating</label>
          <input
            type="number"
            placeholder="Rating"
            name="rating"
            value={series.rating}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Genre</label>
          <input
            type="text"
            placeholder="Genre"
            name="genre"
            value={series.genre.join(", ")}
            onChange={(e) => setSeries({ ...series, genre: e.target.value.split(", ") })}
          />
        </div>
        <div className="addProductItem">
          <label>Language</label>
          <input
            type="text"
            placeholder="Language"
            name="language"
            value={series.language}
            onChange={handleChange}
          />
        </div>
        <div className="addProductItem">
          <label>Country</label>
          <input
            type="text"
            placeholder="Country"
            name="country"
            value={series.country}
            onChange={handleChange}
          />
        </div>
        {series.seasons.map((season, seasonIndex) => (
          <div key={season._id}>
            <h2>Season {season.seasonNumber}</h2>
            <button type="button" onClick={() => addEpisode(seasonIndex)}>Add Episode</button>
            {season.episodes.map((episode, episodeIndex) => (
              <div key={episode._id}>
                <div className="addProductItem">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Title"
                    value={episode.title}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSeries((prevSeries) => {
                        const updatedSeasons = [...prevSeries.seasons];
                        updatedSeasons[seasonIndex].episodes[episodeIndex].title = value;
                        return { ...prevSeries, seasons: updatedSeasons };
                      });
                    }}
                  />
                </div>
                <div className="addProductItem">
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="Description"
                    value={episode.description}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSeries((prevSeries) => {
                        const updatedSeasons = [...prevSeries.seasons];
                        updatedSeasons[seasonIndex].episodes[episodeIndex].description = value;
                        return { ...prevSeries, seasons: updatedSeasons };
                      });
                    }}
                  />
                </div>
                <div className="addProductItem">
                  <label>Duration</label>
                  <input
                    type="text"
                    placeholder="Duration"
                    value={episode.duration}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSeries((prevSeries) => {
                        const updatedSeasons = [...prevSeries.seasons];
                        updatedSeasons[seasonIndex].episodes[episodeIndex].duration = value;
                        return { ...prevSeries, seasons: updatedSeasons };
                      });
                    }}
                  />
                </div>
                <div className="addProductItem">
                  <label>Thumbnail</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "thumbnail", seasonIndex, episodeIndex)}
                  />
                  {episode.thumbnail && (
                    <img src={episode.thumbnail} alt="Episode Thumbnail" />
                  )}
                  <button
                    className="addProductButton"
                    onClick={(e) => handleUpload(e, "thumbnail", seasonIndex, episodeIndex)}
                  >
                    Upload Thumbnail
                  </button>
                </div>
                <div className="addProductItem">
                  <label>URL</label>
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(e, "url", seasonIndex, episodeIndex)}
                  />
                  {episode.url && (
                    <a href={episode.url}>Episode URL</a>
                  )}
                  <button
                    className="addProductButton"
                    onClick={(e) => handleUpload(e, "url", seasonIndex, episodeIndex)}
                  >
                    Upload URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        ))}
        <button type="button" onClick={addSeason}>Add Season</button>
       
          <button className="addProductButton" onClick={handleSubmit}>Create</button>
        
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
