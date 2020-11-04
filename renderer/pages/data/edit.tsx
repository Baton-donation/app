import React, { useState, useEffect, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  getSubmittedSentences,
  deleteSubmittedSentence,
  ISentence,
} from "../../lib/api";

const EditData = () => {
  const [sentences, setSentences] = useState<ISentence[]>([]);

  const refreshSentences = useCallback(async () => {
    const s = await getSubmittedSentences();

    setSentences(s);
  }, []);

  const handleDelete = async (uuid: string) => {
    await deleteSubmittedSentence(uuid);

    await refreshSentences();
  };

  useEffect(() => {
    refreshSentences();
  }, []);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h2">Edit uploaded data</Typography>
      </Grid>

      {sentences.map((sentence) => (
        <Grid item key={sentence.uuid} xs={12}>
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
                      onClick={() => handleDelete(sentence.uuid)}
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
