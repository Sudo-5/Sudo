import {
  Fade,
  Grid,
  makeStyles,
  Modal,
  Backdrop,
  Divider,
  TextField,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import { useMutation, useQuery } from "react-query";
import Layout from "../components/Layout/Layout";
import LearningCard from "../components/LearningCard/LearningCard";
import axios from "../utils/axios";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "2rem 0 0 0",
    display: "flex",
    flexDirection: "column",
  },
  languageContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    padding: "0 0.5rem",
  },
  subContainer: {
    display: "flex",
    flexDirection: "row",
  },
  select: {
    color: "#fff",
    width: "200px",
    border: "2px solid #3f51b5",
  },
  tabs: {
    backgroundColor: "rgba(88,88,88,.5)",
    color: "#fff",
    borderRadius: "10px 10px 0 0",
    padding: "0.6rem",
    width: "fit-content",
    display: "flex",
    border: "0.5px solid #48494B",
  },
  closeIcon: {
    "&:hover": {
      color: "#3f51b5",
      cursor: "pointer",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  video: {
    width: "100%",
    alignSelf: "center",
    "&:focus": {
      outline: "none",
    },
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#1F1F1F",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    borderRadius: "20px",
    width: "1000px",
    "&:focus": {
      outline: "none",
    },
  },
  textField: {
    "& input": {
      color: "#fff",
    },
    "& label": {
      color: "white",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#3f51b5",
    },
  },
}));

const LearningPath = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState({
    technology: "",
    organisation: "",
    repository: "",
  });
  const uploadPath = useMutation((upload) =>
    axios.post("/learning-path/add", upload)
  );

  const fetchPaths = async () => {
    const res = await axios.get("/learning-path/all");
    return res.data;
  };
  const { isLoading, isError, data, error } = useQuery(
    "learning-path",
    fetchPaths
  );

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async () => {
    uploadPath.mutate(state);
  };
  const previewModal = () => {
    return (
      <>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={open}>
            <div className={classes.paper}>
              <h3>Add a Learning Path</h3>
              <Divider style={{ backgroundColor: "#fff" }} />
              <br />
              <TextField
                variant="outlined"
                value={state.technology}
                label="Topic"
                className={classes.textField}
                onChange={(e) => {
                  setState({ ...state, technology: e.target.value });
                }}
              />
              <br />
              <TextField
                variant="outlined"
                label="Organisation"
                value={state.organisation}
                className={classes.textField}
                onChange={(e) => {
                  setState({ ...state, organisation: e.target.value });
                }}
              />
              <br />
              <TextField
                variant="outlined"
                label="Repository"
                value={state.repository}
                className={classes.textField}
                onChange={(e) => {
                  setState({ ...state, repository: e.target.value });
                }}
              />
              <br />
              <br />
              {uploadPath.isLoading ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                  disabled
                >
                  Uploading
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={handleSubmit}
                >
                  Upload
                </Button>
              )}
            </div>
          </Fade>
        </Modal>
      </>
    );
  };

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  if (isLoading) {
    return <Layout>loading...</Layout>;
  }

  return (
    <Layout>
      {previewModal()}
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <h1
            style={{
              fontSize: "4rem",
              fontWeight: 800,
              background: "-webkit-linear-gradient(-70deg,#a2facf,#64acff)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Learning Paths
          </h1>
          <Button
            variant="contained"
            color="primary"
            style={{ alignSelf: "center" }}
            onClick={handleOpen}
          >
            Add a Path
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={2}>
            {data?.data.map((item, index) => (
              <LearningCard topic={item.technology} key={index} id={item._id} />
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default LearningPath;
