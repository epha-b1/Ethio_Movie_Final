import { Link, useLocation, useHistory } from "react-router-dom";
import "./list.css";
import { Publish } from "@material-ui/icons";
import { useContext, useState } from "react";
import { ListContext } from "../../context/listContext/ListContext";
import { updateList } from "../../context/listContext/apiCalls";
import { toast } from "sonner";

export default function List() {
  const location = useLocation();
  const list = location.list;
  const history = useHistory();

  // Get dispatch function from ListContext
  const { dispatch } = useContext(ListContext);

  // State to store updated list data
  const [updatedList, setUpdatedList] = useState({
    title: list.title,
    genre: list.genre,
    type: list.type,
  });

  // Handle input change for updating list data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedList({
      ...updatedList,
      [name]: value,
    });
  };

  // Handle list update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      // Call updateList function from API calls
      await updateList(list._id, updatedList, dispatch); // Pass dispatch as the third argument
      history.push("/lists");
      toast.success("List updated successfully!");
    } catch (err) {
      // Handle update error
      toast.error("Failed to update list. Please try again.");
      console.error("Error updating list:", err);
    }
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">List</h1>
        <Link to="/newList">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopRight">
          <div className="productInfoTop">
            <span className="productName">{list.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{list._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">genre:</span>
              <span className="productInfoValue">{list.genre}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">type:</span>
              <span className="productInfoValue">{list.type}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>List Title</label>
            <input
              type="text"
              name="title"
              value={updatedList.title}
              onChange={handleInputChange}
            />
            <label>Genre</label>
            <input
              type="text"
              name="genre"
              value={updatedList.genre}
              onChange={handleInputChange}
            />
            <label>Type</label>
            <input
              type="text"
              name="type"
              value={updatedList.type}
              onChange={handleInputChange}
            />
          </div>
          <div className="productFormRight">
            <button className="productButton" onClick={handleUpdate}>
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
