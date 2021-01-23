import React, { useState } from "react";
import { useRouter } from "next/router";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { createSettings } from "../../lib/api";

const SecondStep = () => {
  const router = useRouter();
  const [value, setValue] = useState("no");

  const handleNextPage = async () => {
    const usingAnonId = value === "yes";

    await createSettings({ includeId: usingAnonId });

    if (usingAnonId) {
      router.push("/setup/3");
    } else {
      router.push("/setup/4");
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2" gutterBottom>
          Get set up
        </Typography>
      </Grid>

      <Grid item xs={8}>
        <Typography gutterBottom>
          You can also allow us to add an anonymous ID to your uploaded
          sentences. This will help us to better model the data, and improve our
          research.
        </Typography>

        <Typography>
          If you choose not to add an anonymous ID, we&apos;ll still use your
          sentences as part of a global pool. There will be no way to relate the
          sentences to each other, or to you.
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <FormControl component="fieldset">
          <RadioGroup
            aria-label="anon-id"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label="Yes, add an anonymous ID"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="No, don't include an anonymous ID"
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleNextPage}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

export default SecondStep;
