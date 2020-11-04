import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "../components/link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { getStats, IStats } from "../lib/api";

const Dashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<IStats | null>(null);

  useEffect(() => {
    getStats().then((s) => setStats(s));
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">Dashboard</Typography>
      </Grid>

      {stats && stats.submittedSentences > 0 && (
        <Grid item xs={6}>
          <Typography variant="subtitle1">
            Thank you for contributing <b>{stats.submittedSentences}</b>{" "}
            sentences!
          </Typography>
        </Grid>
      )}

      <Grid item xs={12} />

      <Grid item xs={8}>
        {stats && stats.unviewedSentences > 0 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/data/review")}
          >
            Review new sentences
          </Button>
        ) : (
          <Typography>
            There are currently no new sentences available for review.
          </Typography>
        )}
      </Grid>

      {stats && stats.submittedSentences > 0 && (
        <Grid item xs={12}>
          <Link href="/data/edit">Edit uploaded data</Link>
        </Grid>
      )}
    </Grid>
  );
};

Dashboard.breadcrumb = {
  name: "settings",
  href: "/settings",
};

export default Dashboard;
