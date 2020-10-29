import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "../../components/link";
import { default as TextLink } from "@material-ui/core/Link";

const SettingsHome = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">Settings</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          An anonymous ID is currently included when submitting data. Please
          email{" "}
          <TextLink href="mailto:baton@dasher.com">baton@dasher.com</TextLink>{" "}
          with any questions.
        </Typography>
      </Grid>

      <Grid item xs={12} />

      <Grid item xs={12}>
        <Link href="/settings/sources">Edit sources</Link>
      </Grid>
    </Grid>
  );
};

SettingsHome.breadcrumb = {
  name: "back to dashboard",
  href: "/dashboard",
};

export default SettingsHome;
