"use client";
import { useEffect, useState } from "react";
import Search from "./components/Search";
import styles from "@/styles/page.module.css";
import Board from "./components/Board";
import Footer from "./components/Footer";
import { useSearchParams } from "next/navigation";
import axios from "axios";

export interface Board {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const [data, setData] = useState<Board | null>(null);
  const searchParams = useSearchParams(); // Оголошення об'єкта searchParams

  useEffect(() => {
    const googleId = searchParams.get("token"); // Коректний доступ до параметра
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
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <Search setData={setData} />
      <Board data={data ? data : null} />
      <Footer />
    </div>
  );
}
