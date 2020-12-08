import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import CheckCircle from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import PIIWarningIcon from "../../components/pii-warning-icon";
import {
  getSentenceBatch,
  submitSentencesByUUIDs,
  markSentencesAsViewedByUUIDs,
  getStats,
  getSettings,
  ISentence,
  putSettings,
} from "../../lib/api";
import { doesContainPersonalInformation } from "../../lib/pii";

const PER_PAGE_OPTIONS = [5, 7, 10, 15, 20];

const ReviewData = () => {
  const router = useRouter();
  const [selectAllByDefault, setSelectAllByDefault] = useState(false);
  const [batchSize, setBatchSize] = useState(PER_PAGE_OPTIONS[0]);
  const [sentences, setSentences] = useState<ISentence[]>([]);
  const [idsToSubmit, setIdsToSubmit] = useState<string[]>([]);
  const [sentencesLeft, setSentencesLeft] = useState(0);
  const [dangerousSentenceIds, setDangerousSentenceIds] = useState<string[]>(
    []
  );

  // Updates batch, stats, and resets checkmarks
  const refreshSentences = useCallback(async () => {
    const [s, stats] = await Promise.all([
      getSentenceBatch(batchSize),
      getStats(),
    ]);

    if (s.length === 0) {
      router.push("/dashboard");
      return;
    }

    setSentencesLeft(stats.unviewedSentences);

    setSentences(s);
    setIdsToSubmit([]);
  }, [batchSize]);

  // Update batch when size changes
  useEffect(() => {
    // Also runs upon mount
    refreshSentences();
  }, [batchSize]);

  // Runs upon mount
  // Gets settings
  useEffect(() => {
    getSettings().then((settings) => {
      setSelectAllByDefault(settings.defaultToAllSelected);
      setBatchSize(settings.sentencesPerPage);
    });
  }, []);

  // Selects all upon batch change
  // if selectAllByDefault is true
  useEffect(() => {
    if (selectAllByDefault) {
      setIdsToSubmit(
        sentences
          .map((s) => s.uuid)
          .filter((uuid) => !dangerousSentenceIds.includes(uuid))
      );
    }
  }, [sentences, selectAllByDefault, dangerousSentenceIds]);

  // Checks for personal information
  useEffect(() => {
    setDangerousSentenceIds(
      sentences.reduce<string[]>((accum, sentence) => {
        if (doesContainPersonalInformation(sentence.content)) {
          accum.push(sentence.uuid);
        }

        return accum;
      }, [])
    );
  }, [sentences]);

  const areAllSelected = idsToSubmit.length === sentences.length;

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

  const handleSelectAll = () => {
    if (areAllSelected) {
      setIdsToSubmit([]);
    } else {
      setIdsToSubmit(sentences.map((s) => s.uuid));
    }
  };

  const persistBatchSize = async (size: number) => {
    setBatchSize(size);

    await putSettings({ sentencesPerPage: size });
  };

  return (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <Typography variant="h2">Review sentences</Typography>
      </Grid>

      <Grid item container>
        <Grid item>
          <Button
            color="primary"
            startIcon={
              areAllSelected ? <CheckCircle /> : <RadioButtonUncheckedIcon />
            }
            onClick={handleSelectAll}
          >
            Select All
          </Button>
        </Grid>

        <Grid item style={{ marginLeft: "auto" }}>
          <Typography variant="subtitle2">{sentencesLeft} left</Typography>
        </Grid>
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
                          <CheckBoxIcon />
                        ) : (
                          <CheckBoxOutlineBlankIcon />
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

                  {dangerousSentenceIds.includes(sentence.uuid) && (
                    <Grid item xs="auto">
                      <PIIWarningIcon />
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Paper>
          </Box>
        </Grid>
      ))}

      <Grid item container xs={12}>
        <Grid item>
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

        <Grid
          item
          style={{ marginLeft: "auto", display: "flex", alignItems: "center" }}
        >
          <Select
            labelId="per-page-select-label"
            style={{ marginRight: "0.5rem" }}
            value={batchSize}
            onChange={(e) => persistBatchSize(e.target.value as number)}
          >
            {PER_PAGE_OPTIONS.map((option) => (
              <MenuItem value={option} key={option}>
                {option}
              </MenuItem>
            ))}
          </Select>

          <Typography>per page</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

ReviewData.breadcrumb = {
  name: "Dashboard",
  href: "/dashboard",
};

export default ReviewData;
