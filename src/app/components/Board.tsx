import React, { useEffect, useState } from "react";
import { Board as BoardType } from "./Main";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { ColorButton, Item, style } from "../utils/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EditModal from "../UI/Modal";
import { DeleteBoard } from "../UI/DeleteBoard";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

export const ItemTypes = {
  CARD: "cards",
};

interface BoardProps {
  data: BoardType | null;
}

export interface Card {
  _id: string;
  title: string;
  description: string;
  board: string;
  state: string;
}

export default function Board({ data }: BoardProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [modal, setModal] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [cardName, setCardName] = useState<string>("");
  const [descript, setDescript] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [cardData, setCardData] = useState<Card | null>(null);

  const [deleteBoard, setDeleteBoard] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [errorState, setErrorState] = useState<boolean>(false);
  const [successState, setSuccessState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    try {
      if (data) {
        const fetchCards = async () => {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/cards-for-board/${data._id}`
          );
          setCards(response.data);
        };
        fetchCards();
      } else {
        setCards([]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [data, modal, openModal]);

  const moveCard = async (card: Card, newState: string) => {
    setLoading(true);

    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/card`, {
        id: card._id,
        state: newState,
      });
      setCards((prevCards) =>
        prevCards.map((c) =>
          c._id === card._id ? { ...c, state: newState } : c
        )
      );
    } catch (error) {
      console.error("Failed to move card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModal(false);
    setCardName("");
    setMessage("");
    setError(false);
  };
  const handleOpenModal = () => {
    if (data) {
      setModal(true);
    }
  };
  const openEditModal = (card: Card) => {
    setOpenModal(true);
    setCardData(card);
  };
  const handleCloseEditModal = () => {
    setOpenModal(false);
  };

  const addCard = async () => {
    setLoading(true);
    try {
      if (cardName.length > 3 && data) {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/card`,
          {
            title: cardName,
            description: descript || "",
            board: data._id,
            state: "do",
          }
        );
        setSuccessState(true);
        setToastMessage("Create card successfully");
        setTimeout(() => {
          setSuccessState(false);
        }, 2000);
        setModal(false);
        setCardName("");
        setMessage("");
        setError(false);
        setCards([...cards, response.data]);
        handleCloseModal();
      } else {
        setError(true);
        setMessage("Title size is wrong");
      }
    } catch (error) {
      setErrorState(true);
      setToastMessage("Create card successfully");
      console.error(error);
      setTimeout(() => {
        setErrorState(false);
      }, 2000);
    } finally {
      setLoading(false);
    }
  };
  const CardComponent = ({ card }: { card: Card }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [, drag] = useDrag({
      type: ItemTypes.CARD,
      item: { id: card._id, state: card.state },
    });

    drag(ref);

    return (
      <div ref={ref}>
        <Card
          onClick={() => openEditModal(card)}
          variant="outlined"
          sx={{ backgroundColor: "#f1f1f1", marginBottom: 2 }}
        >
          <CardContent sx={{ textAlign: "left" }}>
            <Typography variant="h4">{card.title}</Typography>
            <Typography variant="body2">{card.description}</Typography>
          </CardContent>
        </Card>
      </div>
    );
  };

  const BoardColumn = ({ title, state }: { title: string; state: string }) => {
    const ref = React.useRef<HTMLDivElement>(null);

    const [, drop] = useDrop({
      accept: ItemTypes.CARD,
      drop: (item: { id: string; state: string }) => {
        const draggedCard = cards.find((c) => c._id === item.id);
        if (draggedCard && draggedCard.state !== state) {
          moveCard(draggedCard, state);
        }
      },
    });
    drop(ref);
    return (
      <Grid size={{ xs: 2, sm: 4, md: 3.8 }}>
        <div ref={ref}>
          <Item>
            <Typography variant="h6">{title}</Typography>
            <Box
              sx={{
                minWidth: 275,
                "&:hover": {
                  cursor: "pointer",
                },
              }}
            >
              {cards
                .filter((card) => card.state === state)
                .map((card) => (
                  <CardComponent key={card._id} card={card} />
                ))}
            </Box>
          </Item>
        </div>
      </Grid>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "30px",
      }}
    >
      {data && <h1>Board: {data.name}</h1>}
      {errorState && (
        <Alert
          severity="error"
          onClose={() => setErrorState(false)} // Виправлено
        >
          {toastMessage}
        </Alert>
      )}

      {successState && (
        <Alert
          severity="success"
          onClose={() => setSuccessState(false)} // Виправлено
        >
          {toastMessage}
        </Alert>
      )}
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
            {" "}
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

        <DndProvider backend={HTML5Backend}>
          <Grid
            container
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <BoardColumn title="DO" state="do" />
            <BoardColumn title="Process" state="process" />
            <BoardColumn title="Done" state="done" />
          </Grid>
        </DndProvider>
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
          setSuccessState={setSuccessState}
          setErrorState={setErrorState}
          setToastMessage={setToastMessage}
        />
      )}

      {deleteBoard && (
        <DeleteBoard
          open={deleteBoard}
          data={data === null ? null : data._id}
          handleClose={() => setDeleteBoard(false)}
        />
      )}
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
  );
}
