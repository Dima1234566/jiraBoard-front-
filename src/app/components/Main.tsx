"use client";
import Button from "@mui/material/Button";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";
import Alert from "@mui/material/Alert";
import Footer from "./Footer";
import Search from "./Search";
import Board from "./Board";

export interface Board {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

function Main() {
  const [error, setError] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(false);
  const [data, setData] = useState<Board | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const googleId = searchParams.get("token");
    console.log(googleId);
    if (googleId !== null) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${googleId}`
          );
          setError(false);
          setLogin(true);
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          setError(true);
          setLogin(false);
          console.error("Error fetching user:", error);
        }
      };
      fetchUsers();
    }
  }, []);

  return (
    <>
      {!login && (
        <div
          style={{
            marginTop: "100px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <h1>Welcome to board </h1>
          <div>
            <a href={`${process.env.NEXT_PUBLIC_API_URL}/google/login`}>
              <Button
                endIcon={<GoogleIcon />}
                variant="outlined"
                disableElevation
              >
                Login
              </Button>
            </a>
          </div>
          {error && (
            <Alert severity="error" onClose={() => {}}>
              Authenticator Error{" "}
            </Alert>
          )}
        </div>
      )}

      {login && (
        <div>
          <Search setData={setData} />
          <Board data={data ? data : null} />
          <Footer />
        </div>
      )}
    </>
  );
}

export default Main;
