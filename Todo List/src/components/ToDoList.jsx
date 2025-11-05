// import CssBaseline from '@mui/material/CssBaseline';
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Task from "./Task";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useState, useEffect, useMemo } from "react";
import { useTodos } from "../Contexts/TodosContext";
import { useToast } from "../Contexts/ToastContext";

export default function ToDoList() {
  const { Todos, dispatch } = useTodos();

  const { showHiddenToast } = useToast();
  const [titleInput, setTitleInput] = useState("");
  const [displayedTodosType, setDisplayedTodosType] = useState("all");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogTodo, setDialogTodo] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  //Filteration Arrays

  const completedTodos = useMemo(() => {
    return Todos.filter((t) => {
      return t.isCompleted;
    });
  }, [Todos]);

  const notCompletedTodos = useMemo(() => {
    return Todos.filter((t) => {
      return !t.isCompleted;
    });
  }, [Todos]);

  let todosToBeRendered = Todos;

  if (displayedTodosType === "completed") {
    todosToBeRendered = completedTodos;
  } else if (displayedTodosType === "non-completed") {
    todosToBeRendered = notCompletedTodos;
  } else {
    todosToBeRendered = Todos;
  }

  useEffect(() => {
    dispatch({ type: "get" });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - runs only once on mount

  function changeDisplayType(e) {
    setDisplayedTodosType(e.target.value);
  }

  function handleAddClick() {
    dispatch({ type: "added", payload: { newTitle: titleInput } });

    setTitleInput("");
    showHiddenToast("Your Task has been added successfully!");
  }

  // handle Deletion

  function handleClose() {
    setShowDeleteDialog(false);
  }

  function openDeleteDialog(todo) {
    setDialogTodo(todo);
    setShowDeleteDialog(true);
  }

  function handleDeleteConfirm() {
    dispatch({ type: "deleted", payload: { id: dialogTodo.id } });
    setShowDeleteDialog(false);
    showHiddenToast("Your task has been deleted successfully!");
  }

  //handle updating

  function handleCloseEdit() {
    setShowEditDialog(false);
  }

  function openEditDialog(todo) {
    setDialogTodo(todo);
    setShowEditDialog(true);
  }

  function handleUpdateConfirm(e) {
    e.preventDefault();

    dispatch({
      type: "updated",
      payload: {
        id: dialogTodo.id,
        title: dialogTodo.title,
        details: dialogTodo.details,
      },
    });

    setShowEditDialog(false);
    showHiddenToast("Your task has been updated successfully!");
  }

  const TodosJSX = todosToBeRendered.map((t) => {
    return (
      <Task
        key={t.id}
        todo={t}
        openDeleteDialog={openDeleteDialog}
        openEditDialog={openEditDialog}
      />
    );
  });

  return (
    <>
      {/* Delete Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this task?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            if you delete this task , you won't be able to restore it.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      {/* ===Delete Dialog=== */}

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onClose={handleCloseEdit}>
        <DialogTitle>Edit this task</DialogTitle>
        <DialogContent>
          {dialogTodo && (
            <>
              <form id="subscription-form">
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="email"
                  label="Task Title"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={dialogTodo.title || ""}
                  onChange={(e) => {
                    setDialogTodo({ ...dialogTodo, title: e.target.value });
                  }}
                />
              </form>

              <form id="subscription-form">
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="name"
                  name="email"
                  label="Details"
                  type="text"
                  fullWidth
                  variant="standard"
                  value={dialogTodo.details || ""}
                  onChange={(e) => {
                    setDialogTodo({ ...dialogTodo, details: e.target.value });
                  }}
                />
              </form>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button
            onClick={handleUpdateConfirm}
            disabled={!dialogTodo}
            type="submit"
            form="subscription-form"
          >
            Edit
          </Button>
        </DialogActions>
      </Dialog>
      {/* ===Edit Dialog=== */}
      <Container maxWidth="sm">
        <Card
          sx={{ minWidth: 275 }}
          style={{
            maxHeight: "85vh",
            overflow: "scroll",
          }}
        >
          <CardContent>
            <Typography
              variant="h2"
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              My Tasks
            </Typography>
            <Divider />

            {/* Filter Buttons */}
            <ToggleButtonGroup
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
              value={displayedTodosType}
              onChange={changeDisplayType}
              exclusive
              color="primary"
            >
              <ToggleButton value="all">All</ToggleButton>
              <ToggleButton value="completed">Done</ToggleButton>
              <ToggleButton value="non-completed">Not Yet</ToggleButton>
            </ToggleButtonGroup>
            <div>{TodosJSX}</div>

            {/*FinalButtons*/}

            <Grid
              container
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              sx={{ marginTop: "5px", padding: "0 10px", minWidth: 275 }}
            >
              <Grid item xs={8}>
                <TextField
                  id="outlined-basic"
                  label="Add New Task"
                  variant="outlined"
                  size="large"
                  style={{ width: "100%" }}
                  value={titleInput}
                  onChange={(e) => {
                    setTitleInput(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={4}>
                <Button
                  variant="contained"
                  fullWidth
                  size="meduim"
                  sx={{ height: "55px" }}
                  onClick={() => {
                    handleAddClick();
                  }}
                  disabled={titleInput.length === 0}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
