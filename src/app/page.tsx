"use client";
import { useState } from "react";
import Search from "./components/Search";
import styles from "@/styles/page.module.css";
import Board from "./components/Board";
import Footer from "./components/Footer";

export interface Board {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const [data, setData] = useState<Board | null>(null);
  console.log(data);
  return (
    <div className={styles.container}>
      <Search setData={setData} />
      <Board data={data ? data : null} />
      <Footer />
    </div>
  );
}
