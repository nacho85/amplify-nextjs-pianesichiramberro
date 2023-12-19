"use client";
import { TextField } from "@mui/material";
import styles from "./select-generic.module.css";
import { useState } from "react";

const SelectGeneric = ({ items, onItemSelect, textField }) => {
  const [input, setInput] = useState("");
  const [filtered, setFiltered] = useState(items);
  const onChange = (e) => {
    const input = e.currentTarget.value;

    if (input && input.length > 50) {
      e.preventDefault();
      return;
    }

    if (!input) setFiltered(items);

    if (input) {
      const newFilteredItems = [];
      items.find(
        (item) =>
          item[textField].toLowerCase().indexOf(input.toLowerCase()) > -1 &&
          newFilteredItems.push(item) > 5
      );
      setFiltered(newFilteredItems);
    }

    setInput(input);
  };

  return (
    <div className={styles.selectGenericContainer}>
      <TextField
        label="Buscar"
        className={styles.inputSearch}
        onChange={onChange}
        value={input}
        variant="standard"
      />
      <div className={styles.scrollableBox}>
        <div className={styles.itemsContainer}>
          {(!filtered || filtered?.length === 0) && (
            <label className={styles.noResults}>
              Lo sentimos, no encontramos lo que buscas...
            </label>
          )}
          {filtered?.map((i, ind) => {
            return (
              <div
                key={"item" + ind}
                className={styles.itemBox}
                onClick={() => {
                  onItemSelect(i);
                }}
              >
                {i[textField].toLowerCase()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SelectGeneric;
