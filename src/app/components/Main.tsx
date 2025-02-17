"use client";
import Button from "@mui/material/Button";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
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

function MainContent() {
  const [error, setError] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(false);
  const [data, setData] = useState<Board | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const googleId = searchParams.get("token");
    if (googleId !== null) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${googleId}`
          );
          setError(false);
          setLogin(true);
          localStorage.setItem("user", JSON.stringify(response.data));
          const url = new URL(window.location.href);
          url.searchParams.delete("token");
          window.history.replaceState({}, document.title, url.toString());
        } catch (error) {
          setError(true);
          setLogin(false);
          console.error("Error fetching user:", error);
        }
      };
      fetchUsers();
    } else {
      const user = localStorage.getItem("user");

      if (user) {
        setLogin(true);
      }
    }
  }, [searchParams]);

  return (
    <>
      {!login && (
        <div
          style={{
            height: "100vh",
            background: "linear-gradient(135deg, #e8f5e9, #c8e6c9, #bdbdbd)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <h1>Welcome to board </h1>
          <div style={{ width: 700, textAlign: "center" }}>
            <h4 style={{ fontWeight: "400", lineHeight: "1.6rem" }}>
              Simplify your task management and boost productivity with Daily
              board, the intuitive platform for creating, organizing, and
              tracking your projects. Whether you are managing personal tasks or
              leading a collaborative team, our tool offers the flexibility and
              features you need to succeed.
            </h4>
          </div>

          <div style={{ boxShadow: "0 8px 12px rgba(0, 0, 0, 0.3)" }}>
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
export default function Main() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MainContent />
    </Suspense>
  );
}
