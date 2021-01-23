import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { useRouter } from "next/router";
import { getInstalledApps, importFromInstalledApps } from "../../lib/api";

const buildCommaSeperatedString = (values: string[]) =>
  values.reduce((accum, value, i) => {
    if (values.length === 1) {
      return value;
    }

    if (i === values.length - 1) {
      return `${accum}, and ${value}`;
    }

    return `${accum}, ${value}`;
  }, "");

const ThirdStep = () => {
  const [appNames, setAppNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const goToDashboard = () => router.push("/dashboard");

  useEffect(() => {
    getInstalledApps().then((apps) => {
      if (apps.length === 0) {
        goToDashboard();
      } else {
        setAppNames(apps);
      }
    });
  }, []);

  const handleImport = async () => {
    setLoading(true);

    await importFromInstalledApps();

    goToDashboard();

    setLoading(false);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2" gutterBottom>
          Get set up
        </Typography>
      </Grid>

      <Grid item xs={8}>
        <Typography>
          It looks like you’ve used {buildCommaSeperatedString(appNames)}{" "}
          before. Would you like to import past and future data for manual
          review?
        </Typography>
      </Grid>

      <Grid item xs={12} />

      <Grid item>
        <Button
          onClick={handleImport}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          Import data
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={goToDashboard} disabled={loading}>
          Maybe later
        </Button>
      </Grid>

      {loading && (
        <Grid item>
          <CircularProgress />
        </Grid>
      )}
    </Grid>
  );
};

export default ThirdStep;
