import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Store from "electron-store";
import { Input } from "@material-ui/core";
import { checkUnlockCode } from "../../lib/api";
import Alert from "@material-ui/lab/Alert";

const store = new Store();

const UnlockStep = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [code, setCode] = useState("");
  const router = useRouter();

  useEffect(() => {
    const isUnlocked = store.get("unlocked");

    if (isUnlocked) {
      router.push("/setup/1");
    }
  }, []);

  const handleCodeCheck = async () => {
    try {
      await checkUnlockCode(code);
    } catch {
      setErrorMsg("Error: code is invalid.");
    }

    setErrorMsg("");

    store.set("unlocked", true);

    await router.push("/setup/1");
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Unlock app
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography gutterBottom>
            You should have been provided a 6-digit code by a researcher. Please
            enter it here.
          </Typography>
        </Grid>

        {errorMsg !== "" && (
          <Grid item xs={12}>
            <Alert severity="error">{errorMsg}</Alert>
          </Grid>
        )}

        <Grid item>
          <Input
            placeholder="000000"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </Grid>

        <Grid item>
          <Button variant="contained" color="primary" onClick={handleCodeCheck}>
            Unlock
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default UnlockStep;
