"use client";

import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styleChildModal } from "../utils/styles";
import axios from "axios";

interface DeleteBoard {
  open: boolean;
  data: string | null;
  handleClose: () => void;
}

export function DeleteBoard({ open, data, handleClose }: DeleteBoard) {
  const edited = async () => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/delete-board/${data}`
      );
    } catch (error) {
      console.error(error);
    } finally {
      handleClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="child-modal-title"
      aria-describedby="child-modal-description"
    >
      <Box sx={{ ...styleChildModal, width: 300, padding: 2 }}>
        <h2 id="child-modal-title">Are you sure?</h2>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={edited} variant="contained" color="success">
            Yes
          </Button>
          <Button onClick={handleClose} variant="contained" color="error">
            No
          </Button>
        </div>
      </Box>
    </Modal>
  );
}
