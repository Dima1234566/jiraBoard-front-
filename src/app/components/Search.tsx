"use client";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Fragment, useState } from "react";
import styles from "@/styles/Search.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../utils/styles";
import { Board } from "../page";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";

interface Data {
  setData: (value: Board | null) => void;
}

export default function Search({ setData }: Data) {
  const [open, setOpen] = useState<boolean>(false);
  const [modal, setModal] = useState(false);
  const [options, setOptions] = useState<readonly Board[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [errorState, setErrorState] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);

  const handleSearch = async () => {
    setLoading(true);

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/board`
      );
      setOptions(response.data);
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

  const handleOpen = () => {
    handleSearch();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpenModal = () => {
    setModal(true);
  };

  const handleCloseModal = () => {
    setModal(false);
    setNameInput("");
    setMessage("");
    setError(false);
  };

  const addBoard = async () => {
    setLoading(true);
    setError(false);
    if (nameInput.length > 4) {
      try {
        const newBoard = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/board`,
          {
            name: nameInput,
          }
        );
        setData(newBoard.data);
        setOptions([]);
        setSuccessState(true);
        setTimeout(() => {
          setSuccessState(false);
        }, 2222);
      } catch (error) {
        setErrorState(true);
        console.error(error);
        setTimeout(() => {
          setErrorState(false);
        }, 2222);
      } finally {
        setModal(false);
        setNameInput("");
        setMessage("");
        setError(false);
        setLoading(false);
      }
    } else {
      setError(true);
      setMessage("Length must be more than 4 digits");
      setLoading(false);
      return;
    }
  };

  return (
    <>
      <div className={styles.hero}>
        <Autocomplete
          sx={{ width: 700 }}
          open={open}
          onOpen={handleOpen}
          onClose={handleClose}
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name}
          onChange={(_, value) => setData(value)}
          options={options}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Set board name"
              label="Search a board"
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
        <div>
          <Button
            onClick={handleOpenModal}
            variant="contained"
            disableElevation
          >
            Create Board{" "}
          </Button>
        </div>
        <div>
          <Modal
            open={modal}
            onClose={handleCloseModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style }}>
              <h2 id="parent-modal-title">Create Board</h2>
              <TextField
                sx={{ width: 300 }}
                onChange={(e) => setNameInput(e.target.value)}
                id="standard-basic"
                label="Board name"
                variant="standard"
                error={error}
                helperText={message}
              />
              <Button onClick={addBoard} variant="outlined">
                Create
              </Button>
            </Box>
          </Modal>

          <Backdrop
            sx={(theme) => ({
              color: "#000",
              zIndex: theme.zIndex.drawer + 1,
            })}
            open={loading}
          >
            <CircularProgress />
          </Backdrop>
        </div>
      </div>
      <div
        style={{
          width: "40%",
          margin: " 0 auto",
          paddingTop: "30px",
        }}
      >
        {errorState && (
          <Alert severity="error" onClose={() => {}}>
            Data Loading Error{" "}
          </Alert>
        )}

        {successState && (
          <Alert severity="success" onClose={() => {}}>
            Board created successfully{" "}
          </Alert>
        )}
      </div>
    </>
  );
}
