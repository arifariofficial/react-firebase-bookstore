import { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";

import "./App.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBook from "./components/AddBook";

function App() {
  const [todos, setTodos] = useState([]);

  const appId = "bookstore-c20d9-default-rtdb.europe-west1";

  const columDefs = [
    { field: "title", sortable: true, filter: true },
    { field: "author", sortable: true, filter: true },
    { field: "year", sortable: true, filter: true },
    { field: "isbn", sortable: true, filter: true },
    { field: "price", sortable: true, filter: true },
    {
      headerName: "",
      field: "id",
      width: 90,
      cellRenderer: (params) => (
        <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchItems = () => {
    fetch(`https://${appId}.firebasedatabase.app/books/.json`)
      .then((response) => response.json())
      .then((data) => addKeys(data))
      .catch((err) => console.error(err));
  };

  // Add keys to the todo objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) =>
      Object.defineProperty(item, "id", { value: keys[index] })
    );
    setTodos(valueKeys);
  };

  const addTodo = (newTodo) => {
    fetch("https://todolist-28811-default-rtdb.europe-west1.firebasedatabase.app/items/.json", {
      method: "POST",
      body: JSON.stringify(newTodo),
    })
      .then(() => fetchItems())
      .catch((err) => console.error(err));
  };

  const deleteTodo = (id) => {
    fetch(`https://${appId}.firebasedatabase.app/items/${id}.json`, {
      method: "DELETE",
    })
      .then(() => fetchItems())
      .catch((err) => console.error(err));
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">Bookstore</Typography>
        </Toolbar>
      </AppBar>
      <AddBook addTodo={addTodo} />
      <div className="ag-theme-material" style={{ height: 400, width: 1100 }}>
        <AgGridReact
          colResizeDefault="2"
          rowData={todos}
          columnDefs={columDefs}
          animateRows={true}
        />
      </div>
    </>
  );
}

export default App;
