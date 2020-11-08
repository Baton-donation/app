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
  getStats,
  ISentence,
} from "../../lib/api";

const ReviewData = () => {
  const router = useRouter();
  const [sentences, setSentences] = useState<ISentence[]>([]);
  const [idsToSubmit, setIdsToSubmit] = useState<string[]>([]);
  const [sentencesLeft, setSentencesLeft] = useState(0);

  const refreshSentences = useCallback(async () => {
    const [s, stats] = await Promise.all([getSentenceBatch(), getStats()]);

    if (s.length === 0) {
      router.push("/dashboard");
      return;
    }

    setSentencesLeft(stats.unviewedSentences);

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
    const promises = [
      markSentencesAsViewedByUUIDs(sentences.map((s) => s.uuid)),
    ];

    if (idsToSubmit.length > 0) {
      promises.push(submitSentencesByUUIDs(idsToSubmit));
    }

    await Promise.all(promises);

    await refreshSentences();
  };

  // On first load
  useEffect(() => {
    refreshSentences();
  }, []);

  return (
    <Grid container spacing={5}>
      <Grid item style={{ marginLeft: "auto" }}>
        <Typography variant="subtitle2">{sentencesLeft} left</Typography>
      </Grid>
      {sentences.map((sentence) => (
        <Grid item key={sentence.uuid} xs={12}>
          <Box py={2}>
            <Paper elevation={1}>
              <Box px={2}>
                <Grid container alignItems="center" spacing={3}>
                  <Grid item xs="auto">
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

                  <Grid item xs={10}>
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
