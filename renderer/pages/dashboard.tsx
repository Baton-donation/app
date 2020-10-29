import React from "react";
import { useRouter } from "next/router";
import Link from "../components/link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const Dashboard = () => {
  const router = useRouter();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">Dashboard</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography variant="subtitle1">
          Thank you for contributing <b>50</b> sentences!
        </Typography>
      </Grid>

      <Grid item xs={12} />

      <Grid item xs={8}>
        <Typography>
          There are currently no new sentences available for review.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/data/review")}
        >
          Review new sentences
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Link href="/data/edit">Edit uploaded data</Link>
      </Grid>
    </Grid>
  );
};

Dashboard.breadcrumb = {
  name: "settings",
  href: "/settings",
};

export default Dashboard;
