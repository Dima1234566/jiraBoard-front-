"use client";

import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { styleChildModal } from "../utils/styles";
import axios from "axios";

interface ChildModalProps {
  open: boolean;
  data: any;
  handleClose: () => void;
  onCloseFirstModal: () => void;
  setSuccessState: (state: boolean) => void;
  setErrorState: (state: boolean) => void;
  setToastMessage: (state: string) => void;
}

export function ChildModal({
  open,
  data,
  handleClose,
  onCloseFirstModal,
  setSuccessState,
  setErrorState,
  setToastMessage,
}: ChildModalProps) {
  const edited = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/card`, data);
      setSuccessState(true);
      setToastMessage("Card edit successfully");
      setTimeout(() => {
        setSuccessState(false);
      }, 2222);
    } catch (error) {
      setErrorState(true);
      setToastMessage("Edit card error");
      console.error(error);
      setTimeout(() => {
        setErrorState(false);
      }, 2222);
    } finally {
      handleClose();
      onCloseFirstModal();
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
