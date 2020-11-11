import React, { useEffect, useState, useCallback } from "react";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import CheckCircle from "@material-ui/icons/CheckCircle";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import Delete from "@material-ui/icons/Delete";
import { useRouter } from "next/router";
import Link from "../../components/link";
import { default as TextLink } from "@material-ui/core/Link";
import {
  getSettings,
  deleteAllLocalData,
  ISettings,
  putSettings,
} from "../../lib/api";

const SettingsHome = () => {
  const router = useRouter();
  const [settings, setSettings] = useState<ISettings | null>(null);
  const [showDeletionConfirmation, setShowDeletionConfirmation] = useState(
    false
  );
  const [loading, setLoading] = useState(false);

  const refreshSettings = () => getSettings().then((s) => setSettings(s));

  useEffect(() => {
    refreshSettings();
  }, []);

  const onHide = useCallback(() => {
    if (!loading) {
      setShowDeletionConfirmation(false);
    }
  }, [loading]);

  const handleDataDeletion = async () => {
    setLoading(true);

    await deleteAllLocalData();

    setShowDeletionConfirmation(false);

    // Go to initial setup
    router.push("/");
  };

  const handleToggleAllSelected = async () => {
    if (!settings) {
      return;
    }

    await putSettings({ defaultToAllSelected: !settings.defaultToAllSelected });
    await refreshSettings();
  };

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

      <Grid item xs={12}>
        <Button
          onClick={handleToggleAllSelected}
          startIcon={
            settings?.defaultToAllSelected ? (
              <CheckCircle />
            ) : (
              <RadioButtonUncheckedIcon />
            )
          }
        >
          Default to selecting all sentences
        </Button>
      </Grid>

      <Grid item xs={12}>
        <Button
          color="secondary"
          onClick={() => setShowDeletionConfirmation(true)}
          startIcon={<Delete />}
        >
          Delete all locally stored data
        </Button>
      </Grid>

      <Dialog
        open={showDeletionConfirmation}
        onClose={onHide}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete local data?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Delete all local data stored by Baton. This will not delete
            previously submitted sentences or data from any other apps.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onHide} color="primary" disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleDataDeletion}
            color="secondary"
            disabled={loading}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

SettingsHome.breadcrumb = {
  name: "back to dashboard",
  href: "/dashboard",
};

export default SettingsHome;
