"use client";

import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState, useEffect, Fragment } from "react";
import { Card } from "../components/Board";
import { ChildModal } from "./ChildModal";
import { styleModal } from "../utils/styles";
import { CloseChildModal } from "./CloseChildModal";
import { DeleteModal } from "./DeleteModal";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Board } from "../components/Main";

interface PropModal {
  card: Card | null;
  open: boolean;
  onClose: () => void;
  setSuccessState: (state: boolean) => void;
  setErrorState: (state: boolean) => void;
  setToastMessage: (state: string) => void;
}

export default function EditModal({
  card,
  open,
  onClose,
  setSuccessState,
  setErrorState,
  setToastMessage,
}: PropModal) {
  const [descript, setDescript] = useState<string>("");
  const [cardName, setCardName] = useState<string>("");
  const [openChildModal, setOpenChildModal] = useState<boolean>(false);
  const [dataToSend, setDataToSend] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);
  const [openCloseChildModal, setOpenCloseChildModal] =
    useState<boolean>(false);
  const [cardToDelete, setCardToDelete] = useState<string>("");
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [openChangeBoardModal, setOpenChangeBoardModal] =
    useState<boolean>(false);

  const [boardOpen, setBoardOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<readonly Board[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<Board | null>(null);
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);

  const size = 6;

  useEffect(() => {
    if (card) {
      setCardName(card.title || "");
      setDescript(card.description || "");
    }
  }, [card]);

  const handleSave = () => {
    if (card) {
      const updatedCard = {
        id: card._id,
        title: cardName,
        description: descript,
      };
      setDataToSend(updatedCard);
    }
  };

  const handleChildModalClose = () => {
    setOpenChildModal(false);
  };

  const handleCloseChildModalClose = () => {
    setOpenCloseChildModal(false);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    onClose();
  };

  const handleSearch = async (searchedName?: string) => {
    setLoading(true);
    setBoardOpen(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board/?name=${searchedName}&page=${page}&size=${size}`
      );
      if (response) {
        setOptions((prevOption) =>
          page === 1
            ? response.data.data
            : [...prevOption, ...response.data.data]
        );
        if (response !== null && response.data.data > 0) {
          setHasMore(true);
        }
      }
    } catch (error) {
      setErrorState(true);
      console.error(error);
      setTimeout(() => {
        setErrorState(false);
      }, 1111);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const list = e.currentTarget;
    if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
      if (!loading && hasMore) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const handleClose = () => {
    setBoardOpen(false);
  };

  const updateSwappedCard = async () => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/card`, {
        id: card?._id,
        board: data === null ? null : data._id,
      });
      setSuccessState(true);
      setToastMessage("Card swapped successfully");
      setTimeout(() => {
        setSuccessState(false);
      }, 2222);
    } catch (error) {
      setErrorState(true);
      setToastMessage("Swap card error");
      console.error(error);
      setTimeout(() => {
        setErrorState(false);
      }, 2222);
    } finally {
      onClose();
      setOpenChangeBoardModal(false);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box sx={{ ...styleModal, width: 600 }}>
          <h2 id="edit-modal-title">Editing Card</h2>
          <TextField
            sx={{ width: "100%" }}
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            id="standard-basic"
            label="Card Name"
            variant="standard"
          />
          <br />
          <br />
          <TextField
            sx={{ width: "100%" }}
            value={descript}
            onChange={(e) => setDescript(e.target.value)}
            id="outlined-multiline-static"
            label="Card Description"
            multiline
            rows={6}
          />
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              color="secondary"
              onClick={() => {
                setOpenChangeBoardModal(true);
              }}
              variant="contained"
            >
              Board Swap
            </Button>
            <Button
              style={{ marginLeft: "10px" }}
              onClick={() => {
                handleSave();
                setOpenChildModal(true);
              }}
              variant="contained"
            >
              Save
            </Button>

            <Button
              style={{ marginLeft: "10px" }}
              variant="contained"
              color="error"
              onClick={() => {
                setDeleteModal(true);
                setCardToDelete(card?._id || "");
              }}
            >
              Delete
            </Button>
            <Button
              onClick={() => setOpenCloseChildModal(true)}
              variant="outlined"
              style={{ marginLeft: "10px" }}
            >
              Close
            </Button>
          </div>
          {openChildModal && (
            <ChildModal
              onCloseFirstModal={onClose}
              open={openChildModal}
              data={dataToSend}
              handleClose={handleChildModalClose}
              setSuccessState={setSuccessState}
              setErrorState={setErrorState}
              setToastMessage={setToastMessage}
            />
          )}
          {openCloseChildModal && (
            <CloseChildModal
              onCloseFirstModal={onClose}
              open={openCloseChildModal}
              handleClose={handleCloseChildModalClose}
            />
          )}
        </Box>
      </Modal>
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          data={cardToDelete}
          handleClose={handleCloseDeleteModal}
          setSuccessState={setSuccessState}
          setErrorState={setErrorState}
          setToastMessage={setToastMessage}
        />
      )}
      <Modal
        open={openChangeBoardModal}
        onClose={() => setOpenChangeBoardModal(false)}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box
          sx={{
            ...styleModal,
            width: 500,
            height: 120,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Autocomplete
            sx={{ width: 400, marginTop: "7px" }}
            open={boardOpen}
            onOpen={() => handleSearch(inputValue)}
            onClose={handleClose}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            onChange={(_, value) => setData(value)}
            onInputChange={(_, value) => setInputValue(value)}
            options={options}
            loading={loading}
            ListboxProps={{
              onScroll: handleScroll,
              style: { maxHeight: 200, overflow: "auto" },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Set board name"
                label="Select board"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  },
                }}
              />
            )}
          />
          <Button
            style={{ marginLeft: "10px" }}
            onClick={() => {
              updateSwappedCard();
            }}
            variant="contained"
          >
            Save
          </Button>
          <Button
            onClick={() => setOpenChangeBoardModal(false)}
            variant="outlined"
            style={{ marginLeft: "10px" }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
