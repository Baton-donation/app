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
import Edit from "@material-ui/icons/Edit";
import { useRouter } from "next/router";
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
          Please email{" "}
          <TextLink href="mailto:vertanen@mtu.edu">vertanen@mtu.edu</TextLink>{" "}
          with any questions.
          {settings?.includeUUID
            ? `Your anonymized ID is ${settings?.uuid}.`
            : "You do not have an anonymized ID associated with your data."}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography variant="h5">Data</Typography>
      </Grid>

      <Grid item xs={12}>
        <Button
          startIcon={<Edit />}
          onClick={() => router.push("/settings/sources")}
        >
          Edit data sources
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

      <Grid item xs={12}>
        <Typography variant="h5">Interface</Typography>
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
  name: "Dashboard",
  href: "/dashboard",
};

export default SettingsHome;
