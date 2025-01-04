"use client";
import { useState } from "react";
import Search from "./components/Search";
import styles from "@/styles/page.module.css";
import Board from "./components/Board";

export interface Board {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function Home() {
  const [data, setData] = useState<Board | null>(null);

  return (
    <div className={styles.container}>
      <Search setData={setData} />
      <Board data={data} />
    </div>
  );
}
