import React, { useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { useRouter } from "next/router";
import { getInstalledApps, importFromInstalledApps } from "../../lib/api";

const SecondStep = () => {
  const [appNames, setAppNames] = useState<string[]>([]);
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
    await importFromInstalledApps();

    goToDashboard();
  };

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography variant="h2" gutterBottom>
          First Time Setup
        </Typography>
      </Grid>

      <Grid item xs={8}>
        <Typography>It looks like you&apos;ve used:</Typography>

        <List>
          <ListItem>
            {appNames.map((appName) => (
              <ListItemText primary={appName} key={appName} />
            ))}
          </ListItem>
        </List>

        <Typography>
          in the past. Would you like to automatically import past and future
          data for manual review from these apps?
        </Typography>
      </Grid>

      <Grid item xs={12} />

      <Grid item>
        <Button onClick={handleImport} variant="contained" color="primary">
          Yes
        </Button>
      </Grid>
      <Grid item>
        <Button onClick={goToDashboard}>
          Skip, I&apos;ll set this up later
        </Button>
      </Grid>
    </Grid>
  );
};

export default SecondStep;
