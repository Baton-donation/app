import React, { useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";

const SENTENCES = [
  {
    content: "Hi",
    id: 1,
    willSubmit: false,
  },
  {
    content: "Hi",
    id: 2,
    willSubmit: false,
  },
  {
    content: "Hi",
    id: 3,
    willSubmit: false,
  },
  {
    content: "Hi",
    id: 4,
    willSubmit: false,
  },
  {
    content: "Hi",
    id: 5,
    willSubmit: false,
  },
];

const EditData = () => {
  const [sentences, setSentences] = useState(SENTENCES);

  const handleDelete = (id: number) => {
    setSentences((s) => s.filter((sentence) => sentence.id !== id));
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h2">Edit uploaded data</Typography>
      </Grid>

      {sentences.map((sentence) => (
        <Grid item key={sentence.id} xs={12}>
          <Box py={2}>
            <Paper elevation={1}>
              <Box px={2}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item>
                    <Typography variant="body1">{sentence.content}</Typography>
                  </Grid>

                  <Grid item style={{ marginLeft: "auto" }}>
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      onClick={() => handleDelete(sentence.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

EditData.breadcrumb = {
  name: "back to dashboard",
  href: "/dashboard",
};

export default EditData;
