import Box from "@mui/material/Box";
import { Board as BoardType } from "../page";
import Grid from "@mui/material/Grid2";
import { ColorButton, Item, style } from "../utils/styles";
import { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";

import AddIcon from "@mui/icons-material/Add";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import EditModal from "../UI/Modal";
import { DeleteModal } from "../UI/DeleteModal";
import { DeleteBoard } from "../UI/DeleteBoard";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { title } from "process";

interface BoardProps {
  data: BoardType | null;
}

export interface Card {
  _id: string;
  title: string;
  description: string;
  board: string;
  state: string;
  createdAt?: string;
  updatedAt?: string;
}

export const ItemTypes = {
  CARD: "cards",
};

export default function Board({ data }: BoardProps) {
  const [cards, setCards] = useState([]);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState < string > "";
  const [error, setError] = useState < boolean > false;
  const [cardName, setCardName] = useState < string > "";
  const [descript, setDescript] = useState < string > "";
  const [openModal, setOpenModal] = useState < boolean > false;
  const [cardData, setCardData] = (useState < Card) | (null > null);
  const [deleteModal, setDeleteModal] = useState < boolean > false;
  const [cardToDelete, setCardToDelete] = useState < string > "";
  const [deleteBoard, setDeleteBoard] = useState < boolean > false;

  const [, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item: any) => {
      moveCard(title, item);
    },
    collect: (monitor: any) => ({
      isOver: monitor.isOver(),
    }),
  });

  useEffect(() => {
    try {
      if (data) {
        const fetch = async () => {
          const cards = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/cards-for-board/${data._id}`
          );

          setCards(cards.data);
        };
        fetch();
      }
    } catch (error) {
      console.error(error);
    }
  }, [data, modal, openModal, deleteModal]);

  const handleOpenModal = () => {
    if (data) {
      setModal(true);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    setCardName("");
    setMessage("");
    setError(false);
  };

  const addCard = async () => {
    try {
      if (cardName.length > 3 && data) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/card`, {
          title: cardName,
          description: descript || "",
          board: data._id,
        });
        setModal(false);
        setCardName("");
        setMessage("");
        setError(false);
      } else {
        setError(true);
        setMessage("Title size is wrong");
      }
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const openEditModal = (card: Card) => {
    setOpenModal(true);
    setCardData(card);
  };
  const handleCloseEditModal = () => {
    setOpenModal(false);
  };

  const moveCard = async (title: string, card: Card) => {
    if (title === "do") {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/card`, {
          _id: card._id,
          state: "do",
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (title === "process") {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/card`, {
          _id: card._id,
          state: "process",
        });
      } catch (error) {
        console.error(error);
      }
    }
    if (title === "done") {
      try {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/card`, {
          _id: card._id,
          state: "done",
        });
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "30px",
        marginTop: "30px",
      }}
    >
      {data && <h1>Board name: {data.name}</h1>}
      <Box
        sx={{
          flexGrow: 1,
          padding: "40px",
          backgroundColor: "#f6f7f8",
          width: "100%",
        }}
      >
        {data && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <ColorButton
              variant="contained"
              endIcon={<AddIcon />}
              onClick={handleOpenModal}
            >
              Card
            </ColorButton>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteBoard(true)}
            >
              Board
            </Button>
          </div>
        )}
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {/*
          start board DO
          */}

          <DndProvider backend={HTML5Backend}>
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
              <Item>
                DO
                <Box sx={{ minWidth: 275 }}>
                  {cards &&
                    cards
                      .filter((card: Card) => card.state === "do")
                      .map((card: Card, index) => (
                        <div key={index}>
                          <Card
                            variant="outlined"
                            sx={{ backgroundColor: "#f1f1f1" }}
                          >
                            <CardContent>
                              <Typography variant="h5" component="div">
                                {card.title}
                              </Typography>
                              <Typography variant="body2">
                                {card.description}
                              </Typography>
                            </CardContent>

                            <CardActions>
                              <Button
                                size="small"
                                onClick={() => openEditModal(card)}
                              >
                                Edit
                              </Button>

                              <Button
                                size="small"
                                onClick={() => {
                                  setDeleteModal(true);
                                  setCardToDelete(card._id);
                                }}
                              >
                                Delete
                              </Button>
                            </CardActions>
                          </Card>
                          <br />
                        </div>
                      ))}
                </Box>
              </Item>
            </Grid>

            {/*
          start board progress
          */}
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
              <Item>
                Process
                <Box sx={{ minWidth: 275 }}>
                  {cards &&
                    cards
                      .filter((card: Card) => card.state === "process")
                      .map((card: Card, index) => (
                        <div key={index}>
                          <Card
                            variant="outlined"
                            sx={{ backgroundColor: "#f1f1f1" }}
                          >
                            <CardContent>
                              <Typography variant="h5" component="div">
                                {card.title}
                              </Typography>
                              <Typography variant="body2">
                                {card.description}
                              </Typography>
                            </CardContent>

                            <CardActions>
                              <Button
                                size="small"
                                onClick={() => openEditModal(card)}
                              >
                                Edit
                              </Button>

                              <Button
                                size="small"
                                onClick={() => {
                                  setDeleteModal(true);
                                  setCardToDelete(card._id);
                                }}
                              >
                                Delete
                              </Button>
                            </CardActions>
                          </Card>
                          <br />
                        </div>
                      ))}
                </Box>
              </Item>
            </Grid>

            {/* Start board done                    */}
            <Grid size={{ xs: 2, sm: 4, md: 4 }}>
              <Item>
                Done
                <Box sx={{ minWidth: 275 }}>
                  {cards &&
                    cards
                      .filter((card: Card) => card.state === "done")
                      .map((card: Card, index) => (
                        <div key={index}>
                          <Card
                            variant="outlined"
                            sx={{ backgroundColor: "#f1f1f1" }}
                          >
                            <CardContent>
                              <Typography variant="h5" component="div">
                                {card.title}
                              </Typography>
                              <Typography variant="body2">
                                {card.description}
                              </Typography>
                            </CardContent>

                            <CardActions>
                              <Button
                                size="small"
                                onClick={() => openEditModal(card)}
                              >
                                Edit
                              </Button>

                              <Button
                                size="small"
                                onClick={() => {
                                  setDeleteModal(true);
                                  setCardToDelete(card._id);
                                }}
                              >
                                Delete
                              </Button>
                            </CardActions>
                          </Card>
                          <br />
                        </div>
                      ))}
                </Box>
              </Item>
            </Grid>
          </DndProvider>
        </Grid>
      </Box>
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
            onChange={(e) => setCardName(e.target.value)}
            id="standard-basic"
            label="Card name"
            variant="standard"
            error={error}
            helperText={message}
          />
          <TextField
            sx={{ width: "100%" }}
            onChange={(e) => setDescript(e.target.value)}
            id="outlined-multiline-static"
            label="Card description"
            multiline
            rows={6}
            defaultValue={"sfff 123  ,,aaa"}
          />
          <Button onClick={addCard} variant="outlined">
            Create
          </Button>
        </Box>
      </Modal>
      {openModal && (
        <EditModal
          card={cardData}
          open={openModal}
          onClose={handleCloseEditModal}
        />
      )}
      {deleteModal && (
        <DeleteModal
          open={deleteModal}
          data={cardToDelete}
          handleClose={() => setDeleteModal(false)}
        />
      )}

      {deleteBoard && (
        <DeleteBoard
          open={deleteBoard}
          data={data._id}
          handleClose={() => setDeleteBoard(false)}
        />
      )}
    </div>
  );
}
