import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import CheckCircle from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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

const ReviewData = () => {
  const [sentences, setSentences] = useState(SENTENCES);

  const areAnySelected = sentences.find((s) => s.willSubmit) !== undefined;

  const handleSendToggle = (id: number, shouldSubmit: boolean) => {
    setSentences((s) =>
      s.map((sentence) =>
        sentence.id === id
          ? { ...sentence, willSubmit: shouldSubmit }
          : sentence
      )
    );
  };

  return (
    <Grid container spacing={5}>
      <Grid item style={{ marginLeft: "auto" }}>
        <Typography variant="subtitle2">10-15 of 55</Typography>
      </Grid>
      {sentences.map((sentence) => (
        <Grid
          item
          key={sentence.id}
          xs={12}
          onClick={() => handleSendToggle(sentence.id!, !sentence.willSubmit)}
        >
          <Box py={2}>
            <Paper elevation={1}>
              <Box px={2}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item>
                    <Button
                      variant={sentence.willSubmit ? "contained" : "outlined"}
                      color="primary"
                      startIcon={
                        sentence.willSubmit ? (
                          <CheckCircle />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )
                      }
                      onClick={() =>
                        handleSendToggle(sentence.id!, !sentence.willSubmit)
                      }
                    >
                      Send
                    </Button>
                  </Grid>

                  <Grid item>
                    <Typography variant="body1">{sentence.content}</Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button
          startIcon={areAnySelected ? <CloudUploadIcon /> : <SkipNextIcon />}
          color="secondary"
          variant="contained"
        >
          {areAnySelected ? "Submit" : "Skip"} and move to next
        </Button>
      </Grid>
    </Grid>
  );
};

ReviewData.breadcrumb = {
  name: "back to dashboard",
  href: "/dashboard",
};

export default ReviewData;
