import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
  useMemo,
} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Virtuoso } from "react-virtuoso";
import { useWindowSize } from "react-use";
import PIIWarningIcon from "../../components/pii-warning-icon";
import {
  getSubmittedSentences,
  deleteSubmittedSentence,
  ISentence,
} from "../../lib/api";
import { doesContainPersonalInformation } from "../../lib/pii";

const CHUNK_SIZE = 10;

const SentenceRow = ({
  sentence,
  onDelete,
  dangerous,
}: {
  sentence: ISentence;
  onDelete: (uuid: string) => void;
  dangerous: boolean;
}) => (
  <Box>
    <div style={{ height: "1.5rem" }} />
    <Paper elevation={1}>
      <Box px={2}>
        <Grid container alignItems="center" spacing={3}>
          <Grid item xs={10}>
            <Typography variant="body1">{sentence.content}</Typography>
          </Grid>

          <Grid
            item
            xs="auto"
            container
            style={{ marginLeft: "auto", width: "auto" }}
            alignItems="center"
          >
            <Grid item>{dangerous && <PIIWarningIcon />}</Grid>

            <Grid item>
              <IconButton
                aria-label="delete"
                color="secondary"
                onClick={() => onDelete(sentence.uuid)}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
    <div style={{ height: "1.5rem" }} />
  </Box>
);

const EditData = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const [sentences, setSentences] = useState<ISentence[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const [loadedOffsets, setLoadedOffsets] = useState<number[]>([]);

  const { height: windowHeight } = useWindowSize();

  const loadMore = useCallback(async () => {
    const offset = sentences.length;

    if (loadedOffsets.includes(offset)) {
      return;
    }

    setLoadedOffsets((offsets) => [...offsets, offset]);

    setIsLoading(true);
    const s = await getSubmittedSentences({ limit: CHUNK_SIZE, offset });
    setSentences((currentSentences) => [
      ...currentSentences,
      ...s.filter((p) => !currentSentences.find((c) => c.uuid == p.uuid)),
    ]);
    setIsLoading(false);
  }, [loadedOffsets, sentences]);

  const handleDelete = useCallback(async (uuid: string) => {
    await deleteSubmittedSentence(uuid);

    setSentences((currentSentences) =>
      currentSentences.filter((s) => s.uuid !== uuid)
    );
  }, []);

  const dangerousSentenceIndices = useMemo(
    () =>
      sentences.reduce<number[]>((accum, sentence, i) => {
        if (doesContainPersonalInformation(sentence.content)) {
          accum.push(i);
        }

        return accum;
      }, []),
    [sentences]
  );

  useEffect(() => {
    loadMore();
  }, []);

  useLayoutEffect(() => {
    if (headerRef.current) {
      const headerRect = headerRef.current.getBoundingClientRect();

      setScrollableHeight(windowHeight - headerRect.bottom);
    }
  }, [headerRef, windowHeight]);

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} ref={headerRef}>
        <Typography variant="h2">Edit submitted sentences</Typography>
      </Grid>

      <Virtuoso
        style={{
          width: "100%",
          height: `${scrollableHeight}px`,
          marginLeft: "2rem",
          marginRight: "2rem",
        }}
        overscan={500}
        totalCount={sentences.length}
        itemContent={(index) => (
          <SentenceRow
            sentence={sentences[index]}
            onDelete={handleDelete}
            dangerous={dangerousSentenceIndices.includes(index)}
          />
        )}
        endReached={() => loadMore()}
        atBottomStateChange={(atBottom) => {
          if (atBottom) {
            loadMore();
          }
        }}
        footer={() =>
          isLoading ? <LinearProgress style={{ height: "1rem" }} /> : <div />
        }
      />
    </Grid>
  );
};

EditData.breadcrumb = {
  name: "Dashboard",
  href: "/dashboard",
};

export default EditData;
