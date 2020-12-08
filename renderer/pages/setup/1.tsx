import React from "react";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";

const FirstStep = () => {
  const router = useRouter();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2" gutterBottom>
          Get set up
        </Typography>
      </Grid>

      <Grid item xs={8}>
        <Typography>Placeholder for consent agreement.</Typography>

        <Typography>By proceeding, you agree to the above.</Typography>
      </Grid>

      <Grid item xs={12} />

      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/setup/2")}
      >
        Agree and continue
      </Button>
    </Grid>
  );
};

export default FirstStep;
