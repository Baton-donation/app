import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import CheckCircle from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  getSentenceBatch,
  submitSentencesByUUIDs,
  markSentencesAsViewedByUUIDs,
  ISentence,
} from "../../lib/api";

const ReviewData = () => {
  const router = useRouter();
  const [sentences, setSentences] = useState<ISentence[]>([]);
  const [idsToSubmit, setIdsToSubmit] = useState<string[]>([]);

  const refreshSentences = useCallback(async () => {
    const s = await getSentenceBatch();

    if (s.length === 0) {
      router.push("/dashboard");
      return;
    }

    setSentences(s);
    setIdsToSubmit([]);
  }, []);

  const handleSendToggle = (uuid: string) => {
    setIdsToSubmit((currentIds) => {
      if (currentIds.includes(uuid)) {
        return currentIds.filter((i) => i !== uuid);
      }

      return [...currentIds, uuid];
    });
  };

  const handleSubmit = async () => {
    if (idsToSubmit.length > 0) {
      await Promise.all([
        submitSentencesByUUIDs(idsToSubmit),
        markSentencesAsViewedByUUIDs(sentences.map((s) => s.uuid)),
      ]);
    }

    await refreshSentences();
  };

  // On first load
  useEffect(() => {
    refreshSentences();
  }, []);

  return (
    <Grid container spacing={5}>
      <Grid item style={{ marginLeft: "auto" }}>
        <Typography variant="subtitle2">10-15 of 55</Typography>
      </Grid>
      {sentences.map((sentence) => (
        <Grid item key={sentence.uuid} xs={12}>
          <Box py={2}>
            <Paper elevation={1}>
              <Box px={2}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item>
                    <Button
                      variant={
                        idsToSubmit.includes(sentence.uuid)
                          ? "contained"
                          : "outlined"
                      }
                      color="primary"
                      startIcon={
                        idsToSubmit.includes(sentence.uuid) ? (
                          <CheckCircle />
                        ) : (
                          <RadioButtonUncheckedIcon />
                        )
                      }
                      onClick={() => handleSendToggle(sentence.uuid)}
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
          startIcon={
            idsToSubmit.length === 0 ? <SkipNextIcon /> : <CloudUploadIcon />
          }
          color="secondary"
          variant="contained"
          onClick={handleSubmit}
        >
          {idsToSubmit.length === 0 ? "Skip" : "Submit"} and move to next
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
