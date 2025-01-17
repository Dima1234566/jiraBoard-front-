"use client";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import styles from "@/styles/Search.module.css";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { style } from "../utils/styles";
import Backdrop from "@mui/material/Backdrop";
import Alert from "@mui/material/Alert";
import logo from "../../../public/logo.png";
import Image from "next/image";
import { Board } from "./Main";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Tooltip from "@mui/material/Tooltip";

interface Data {
  setData: (value: Board | null) => void;
}

export interface User {
  _id: string;
  firstName: string;
  email: string;
  googleId: string;
  createdAt: string; // ISO-8601 дата у форматі рядка
  updatedAt: string; // ISO-8601 дата у форматі рядка
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
  const [page, setPage] = useState<number>(1);
  const [inputValue, setInputValue] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);

  const size = 6;

  const handleSearch = async (startPage: number, searchedName?: string) => {
    setLoading(true);
    setOpen(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/my-boards/${user?.googleId}/?name=${searchedName}&page=${startPage}&size=${size}`
      );
      if (searchedName && searchedName?.length >= 3) {
        setOptions(response.data.data);
      } else if (response.data) {
        const newOptions = response.data.data.filter(
          (item: Board) => !options.some((option) => option._id === item._id)
        );
        setOptions((prevOptions) => [...prevOptions, ...newOptions]);

        if (response.data.data.length < size) {
          setHasMore(false);
        } else {
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
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

  const handleScroll = (
    e: React.UIEvent<HTMLElement>,
    load: (page: number, searchString: string) => void
  ) => {
    const list = e.currentTarget;
    if (list.scrollTop + list.clientHeight >= list.scrollHeight) {
      if (!loading && hasMore) {
        setPage((prevPage) => {
          const nextPage = prevPage + 1;
          load(nextPage, "");
          return nextPage;
        });
      }
    }
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
            googleId: user?.googleId,
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

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      try {
        const parse = JSON.parse(user);
        setUser(parse);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      console.error("No user found in localStorage");
    }
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <a>
          <div className={styles.logoWrapper}>
            <Image src={logo} alt="Logo" width={55} height={55} />
          </div>
        </a>

        <div className={styles.hero}>
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <Autocomplete
              sx={{ width: 700 }}
              open={open}
              onOpen={() => handleSearch(page, inputValue)}
              onClose={handleClose}
              isOptionEqualToValue={(option, value) =>
                option.name === value.name
              }
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => setData(value ? value : null)}
              onInputChange={(_, value) => setInputValue(value)}
              options={options}
              loading={loading}
              ListboxProps={{
                onScroll: (e) => handleScroll(e, handleSearch),
                style: { maxHeight: 200, overflow: "auto" },
              }}
              renderOption={(props, option) => (
                <li {...props} key={Math.floor(Math.random() * 1000)}>
                  {option.name}
                </li>
              )}
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

            <Button
              onClick={handleOpenModal}
              variant="contained"
              disableElevation
            >
              Create Board
            </Button>
          </div>
        </div>
        <div style={{}}>Name: {user !== null ? user.firstName : ""}</div>
        <div>
          <Tooltip title="Logout">
            <ExitToAppIcon
              sx={{ color: "pink", cursor: "pointer" }}
              onClick={() => handleLogout()}
            />
          </Tooltip>
        </div>
        <div>
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
          margin: "0 auto",
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
          <div>
            <Button onClick={addBoard} variant="outlined">
              Create
            </Button>
            <Button
              style={{ marginLeft: 25 }}
              onClick={handleCloseModal}
              variant="outlined"
            >
              Cancel
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
