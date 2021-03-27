import { Grid } from "@material-ui/core";
import MDEditor from "@uiw/react-md-editor";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import Layout from "../components/Layout/Layout";
import axios from "../utils/axios";

const LearningPathDetail = () => {
  const { id } = useParams();
  const fetchPaths = async () => {
    const res = await axios.get(`/learning-path/path/${id}`);
    return res.data;
  };
  const { isLoading, isError, data, error } = useQuery(
    `path-${id}`,
    fetchPaths
  );
  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  if (isLoading) {
    return <Layout>loading...</Layout>;
  }
  return (
    <Layout>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <h1>{data?.data.technology}</h1>
        </Grid>
        <Grid item xs={12}>
          <div
            style={{
              borderRadius: 10,
              border: "1px solid #30363d",
              padding: "1rem",
            }}
          >
            <MDEditor.Markdown source={data?.data.readme} />
            {/* <ReactMarkdown children={data?.data.readme} /> */}
          </div>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default LearningPathDetail;
