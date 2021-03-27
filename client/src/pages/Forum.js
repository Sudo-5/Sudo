import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import {
  Grid,
  makeStyles,
  Button,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useParams } from "react-router-dom";

import MDEditor from "@uiw/react-md-editor";
import axios from "../utils/axios";
import { ControlledEditor } from "@monaco-editor/react";
import QuestionBody from "../components/Forum/QuestionBody";
import AnswerBody from "../components/Forum/AnswerBody";
const useStyles = makeStyles((theme) => ({
  root: {
    padding: "20px",
  },
  heading: {
    fontSize: "30px",
  },
}));

const mkdStr = `# Your answer here!

**Hello world!!!**


`;

const Forum = () => {
  const classes = useStyles();
  const [yourAnswer, setYourAnswer] = useState(mkdStr);
  let { id } = useParams();
  const [question, setQuestion] = useState({});
  const [language, setLanguage] = useState("javascript");
  const [isCode, setIsCode] = useState(false);

  const [questionFile, setQuestionFile] = useState(undefined);

  const handleEditorChange = (e, value) => {
    setQuestionFile(value);
  };

  const getCurrentQuestion = async () => {
    const { data } = await axios.get(`/questions/${id}`);
    // console.log(data);
    setQuestion(data);
  };

  const getQuestionFileData = async () => {
    if (!question || !question.fileKey) return;

    const {
      data: { fileData },
    } = await axios.get(`/questions/file/${question.fileKey}`);
    console.log(fileData);
    setQuestionFile(fileData);
  };

  useEffect(() => {
    getQuestionFileData();
  }, [question]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getCurrentQuestion();
  }, []);
  const postAnswer = async () => {
    const { data } = await axios.post(
      "/questions/answer/new",
      {
        markdown: yourAnswer,
        question: question._id,
      },
      {
        withCredentials: true,
      }
    );
    const answers = [...question.answers];
    answers.push(data);
    setQuestion({ ...question, answers });
  };

  if (!question._id) return null;
  return (
    <>
      <Layout>
        <Grid item xs={12} className={classes.root}>
          <QuestionBody
            question={question}
            setQuestion={setQuestion}
            classes={classes}
          />
          <p
            style={{
              paddingLeft: "20px",
              fontSize: "1.6rem",
            }}
          >
            {`${question.answers.length} Answers`}
          </p>
          <Grid container spacing={2} style={{ marginTop: 10 }}>
            {question.answers.map((answer) => (
              <AnswerBody
                answer={answer}
                question={question}
                setQuestion={setQuestion}
              />
            ))}
            <Grid item xs={12}>
              <p style={{ fontSize: "1.6rem" }}>Your Answer</p>
              <MDEditor value={yourAnswer} onChange={setYourAnswer} />
              <Grid
                item
                xs={12}
                style={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Button
                  disabled={questionFile === undefined}
                  setIsCode={() => setIsCode(true)}
                  variant="contained"
                  color="primary"
                >
                  View Code
                </Button>
                <Button variant="contained" color="primary">
                  Fork your Copy of Code
                </Button>
              </Grid>
              <Button
                variant="contained"
                color="primary"
                style={{
                  marginTop: "30px",
                }}
                onClick={postAnswer}
              >
                Post Your Answer
              </Button>
            </Grid>
            {isCode && (
              <>
                <FormControl variant="filled" className={classes.formControl}>
                  <Select
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                    }}
                    inputProps={{
                      className: classes.select,
                    }}
                    variant="outlined"
                  >
                    <MenuItem value={"javascript"}>javascript</MenuItem>
                    <MenuItem value={"typescript"}>typescript</MenuItem>
                    <MenuItem value={"python"}>python</MenuItem>
                  </Select>
                </FormControl>
                <ControlledEditor
                  height="80vh"
                  value={questionFile}
                  onChange={handleEditorChange}
                  theme="dark"
                  language={language}
                />
              </>
            )}
          </Grid>
        </Grid>
      </Layout>
    </>
  );
};

export default Forum;
