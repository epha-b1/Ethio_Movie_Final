import { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import ConfirmDialog from '../../components/confirmDialoge/ConfirmDialog '; // Import the ConfirmDialog component
import "./seriesList.css"; // Import the CSS for SeriesList

export default function SeriesList() {
  const [series, setSeries] = useState([]);
  const [selectedSeriesId, setSelectedSeriesId] = useState(null); // State to track the selected series ID for deletion
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State to manage the visibility of the confirmation dialog

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await axios.get("/serious", {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });

      setSeries(res.data);
      console.log(series);
    } catch (error) {
      console.error("Error fetching series:", error);
    }
  };

  const handleDelete = (id) => {
    setSelectedSeriesId(id); // Set the selected series ID for deletion
    setIsConfirmDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/serious/${selectedSeriesId}`, {
        headers: {
          token:
            "Bearer " + JSON.parse(localStorage.getItem("user")).accessToken,
        },
      });
      setSeries(series.filter((item) => item._id !== selectedSeriesId));
      toast.success("Delete successful!");
    } catch (error) {
      console.log("Error deleting series:", error);
      toast.error("Delete error!");
    }
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img
              className="productListImg"
              src={params.row.seasons[0].episodes[0].thumbnail}
              alt=""
            />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "description", headerName: "Description", width: 200 },
    { field: "rating", headerName: "Rating", width: 120 },
    { field: "language", headerName: "Language", width: 120 },
    { field: "country", headerName: "Country", width: 120 },
    {
      field: "seasonLength",
      headerName: "Season Length",
      width: 200,
      renderCell: (params) => {
        const totalSeasons = params.row.seasons.length;
        const totalEpisodes = params.row.seasons.reduce((acc, season) => {
          return acc + season.episodes.length;
        }, 0);
        const totalEpisodeLength = params.row.seasons.reduce((acc, season) => {
          return (
            acc +
            season.episodes.reduce((total, episode) => {
              return total + parseInt(episode.duration);
            }, 0)
          );
        }, 0);

        return `${totalSeasons} season(s), ${totalEpisodes} episode(s), ${totalEpisodeLength} minutes`;
      },
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link
              to={{ pathname: "/series/" + params.row._id, series: params.row }}
            >
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      <ConfirmDialog
        open={isConfirmDialogOpen}
        handleClose={handleCloseConfirmDialog}
        handleConfirm={handleConfirmDelete}
      />
      <DataGrid
        rows={series}
        disableSelectionOnClick
        columns={columns}
        pageSize={8}
        checkboxSelection
        getRowId={(r) => r._id}
      />
    </div>
  );
}
