import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { getPossibleNewSources, addSource } from "../../lib/api";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

const AddSource = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [sources, setSources] = useState<string[]>([]);
  const [selectedSource, setSelectedSource] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    getPossibleNewSources().then((s) => {
      setSources(s);
      setSelectedSource(s[0] ?? "");
    });
  }, []);

  useEffect(() => {
    setFile(null);
  }, [selectedSource]);

  const isFormValid = useMemo(() => {
    if (selectedSource === "Plain Text") {
      return file !== null && file !== undefined;
    } else if (selectedSource !== "") {
      return true;
    }

    return false;
  }, [file, selectedSource]);

  const handleAdd = async () => {
    setLoading(true);
    await addSource({ name: selectedSource, path: file?.path ?? "" });
    setLoading(false);
    await router.push("/settings/sources");
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">Add source</Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography>Available data sources:</Typography>
        <Select
          labelId="per-page-select-label"
          style={{ marginRight: "0.5rem" }}
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value as string)}
        >
          {sources.map((source) => (
            <MenuItem value={source} key={source}>
              {source}
            </MenuItem>
          ))}
        </Select>
      </Grid>

      {selectedSource === "Grid" && (
        <Grid item xs={12}>
          <Typography variant="body1" color="error">
            This will upload phrases from every Grid user on this computer.
          </Typography>
        </Grid>
      )}

      {selectedSource === "Plain Text" && (
        <Grid item container xs={12} alignItems="center" spacing={1}>
          <Grid item>
            <input
              accept="text/plain"
              type="file"
              style={{ display: "none" }}
              id="file-select"
              onChange={(e) =>
                setFile(e.target.files ? e.target.files[0] : null)
              }
            />
            <label htmlFor="file-select">
              <Button component="span" variant="contained">
                Select file
              </Button>
            </label>
          </Grid>

          {file && (
            <Grid item>
              <Typography>{file.name}</Typography>
            </Grid>
          )}
        </Grid>
      )}

      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          disabled={!isFormValid || loading}
          onClick={handleAdd}
          endIcon={loading ? <CircularProgress size="0.875rem" /> : null}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

AddSource.breadcrumb = {
  name: "Sources",
  href: "/settings/sources",
};

export default AddSource;
