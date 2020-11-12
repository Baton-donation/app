import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "../components/link";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { getStats, IStats, refreshData } from "../lib/api";

const Dashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<IStats | null>(null);

  const refreshStats = () => getStats().then((s) => setStats(s));

  useEffect(() => {
    refreshStats();
  }, []);

  const handleDataRefresh = async () => {
    setLoading(true);

    await refreshData();
    await refreshStats();

    setLoading(false);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">Dashboard</Typography>
      </Grid>

      {stats && stats.submittedSentences > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            Thank you for contributing <b>{stats.submittedSentences}</b>{" "}
            sentences!
          </Typography>
        </Grid>
      )}

      {stats && stats.unviewedSentences > 0 && (
        <Grid item xs={12}>
          <Typography variant="subtitle1">
            There are <b>{stats.unviewedSentences}</b> sentences to review.
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
            disabled={loading}
          >
            Review new sentences
          </Button>
        ) : (
          <Typography>
            There are currently no new sentences available for review.
          </Typography>
        )}
      </Grid>

      <Grid item xs={12}>
        <Button onClick={handleDataRefresh} disabled={loading}>
          Refresh data
        </Button>

        {loading && <CircularProgress size="1rem" />}
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
