import React, { useEffect, useState } from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Link from "../../components/link";
import { default as TextLink } from "@material-ui/core/Link";
import { getSettings, ISettings } from "../../lib/api";

const SettingsHome = () => {
  const [settings, setSettings] = useState<ISettings | null>(null);

  useEffect(() => {
    getSettings().then((s) => setSettings(s));
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2">Settings</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>
          An anonymous ID is currently{" "}
          {settings?.includeUUID ? <b>included</b> : <b>not included</b>} when
          submitting data.{" "}
          {settings?.includeUUID ? `Your ID is ${settings?.uuid}.` : ""} Please
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
