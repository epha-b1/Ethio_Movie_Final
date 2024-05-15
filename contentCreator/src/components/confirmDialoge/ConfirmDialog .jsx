import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const ConfirmDialog = ({ open, handleClose, handleConfirm }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>Are you sure you want to delete this?</DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          style={{ backgroundColor: "white", color: "black" }} // Change background to red and text to white
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          style={{ backgroundColor: "#FF0000", color: "#FFFFFF" }} // Change background to green and text to white
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
