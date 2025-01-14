"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Search from "./components/Search";
import styles from "@/styles/page.module.css";
import Board from "./components/Board";
import Footer from "./components/Footer";
import axios from "axios";
import { useRouter } from "next/router";

export interface Board {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default dynamic(() => Promise.resolve(Home), { ssr: false });

function Home() {
  const [data, setData] = useState<Board | null>(null);

  const router = useRouter();
  const { query } = router;

  useEffect(() => {
    const googleId = query.token;
    if (googleId) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/user/${googleId}`
          );
          localStorage.setItem("user", JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      };
      fetchUsers();
    }
  }, [query]);

  return (
    <div className={styles.container}>
      <Search setData={setData} />
      <Board data={data ? data : null} />
      <Footer />
    </div>
  );
}
