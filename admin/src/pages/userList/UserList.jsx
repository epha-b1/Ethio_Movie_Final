import "./userList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext/UserContext";
import { deleteUser, getUsers } from "../../context/userContext/apiCalls";
import ConfirmDialog from '../../components/confirmDialoge/ConfirmDialog '; // Import the ConfirmDialog component

export default function UserList() {
  const { users, dispatch } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);
  const [roleNames, setRoleNames] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null); // State to track the selected user ID for deletion
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false); // State to manage the visibility of the confirmation dialog

  useEffect(() => {
    getUsers(dispatch)
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error fetching users:", error));
  }, [dispatch]);

  useEffect(() => {
    // Fetch role names
    const fetchRoleNames = async () => {
      try {
        const response = await fetch("/role");
        const data = await response.json();
        const roleNamesMap = {};
        data.forEach((role) => {
          roleNamesMap[role._id] = role.role_name;
        });
        setRoleNames(roleNamesMap);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoleNames();
  }, []);

  const handleDelete = (id) => {
    setSelectedUserId(id); // Set the selected user ID for deletion
    setIsConfirmDialogOpen(true); // Open the confirmation dialog
  };

  const handleConfirmDelete = () => {
    deleteUser(selectedUserId, dispatch); // Delete the user
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };

  const handleCloseConfirmDialog = () => {
    setIsConfirmDialogOpen(false); // Close the confirmation dialog
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 150 },
    {
      field: "username",
      headerName: "Username",
      width: 150,
    },
    { field: "email", headerName: "Email", width: 200 },
    { field: "phoneNumber", headerName: "Phone Number", width: 150 },
    { field: "isVerified", headerName: "isVerfied", width: 150 },
    {
      field: "role",
      headerName: "Role",
      width: 150,
      valueGetter: (params) => {
        return roleNames[params.row.role] || "Unknown";
      },
    },
    {
      field: "isSubscribed",
      headerName: "Subscribed",
      width: 150,
      renderCell: (params) => {
        return (
          <div className="userListSubscribed">
            {params.row.subscription ? "Yes" : "No"}
          </div>
        );
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
              to={{ pathname: "/user/" + params.row._id, user: params.row }}
            >
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row._id)} 
            />
          </>
        );
      },
    },
  ];

  // Assign _id as id for each user
  const rows = users.map((user) => ({ ...user, id: user._id }));

  return (
    <div className="userList">
      <ConfirmDialog
        open={isConfirmDialogOpen}
        handleClose={handleCloseConfirmDialog}
        handleConfirm={handleConfirmDelete}
      />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <DataGrid
          rows={rows}
          disableSelectionOnClick
          columns={columns}
          pageSize={8}
          checkboxSelection
        />
      )}
    </div>
  );
}
