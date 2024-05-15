import "./movieList.css"
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { MovieContext } from "../../context/movieContext/MovieContext";
import { deleteMovie, getMovies } from "../../context/movieContext/apiCalls";
import ConfirmDialog from '../../components/confirmDialoge/ConfirmDialog '; // Import the ConfirmDialog component

export default function MovieList() {
  const { movies, dispatch } = useContext(MovieContext);
  const [selectedMovieId, setSelectedMovieId] = useState(null); // State to track the selected movie ID for deletion
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State to manage the visibility of the confirmation dialog

  useEffect(() => {
    const fetchMovies = async () => {
      await getMovies(dispatch);
    };

    fetchMovies();
  }, [dispatch]);

  const handleDelete = (id) => {
    setSelectedMovieId(id); // Set the selected movie ID for deletion
    setIsConfirmDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = async () => {
    await deleteMovie(selectedMovieId, dispatch); // Delete the movie
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 90 },
    {
      field: "movie",
      headerName: "Movie",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params.row.img} alt="" />
            <b>{params.row.title}</b>
          </div>
        );
      },
    },
    { field: "genre", headerName: "Genre", width: 120 },
    { field: "releaseDate", headerName: "year", width: 120 },
    { field: "rating", headerName: "rating", width: 120 },
    { field: "duration", headerName: "duration", width: 120 },

    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link
              to={{ pathname: "/movie/" + params.row._id, movie: params.row }}
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

  const rows = movies.map((movie) => ({ ...movie, id: movie._id }));

  return (
    <div className="productList">
      <ConfirmDialog
        open={isConfirmDialogOpen}
        handleClose={handleCloseConfirmDialog}
        handleConfirm={handleConfirmDelete}
      />
        <DataGrid
          rows={rows}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          checkboxSelection
        />
  
    </div>
  );
}
