import React, { useState } from "react";
import { useRouter } from "next/router";
import Radio from "@material-ui/core/Radio";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { FormControl, FormControlLabel, RadioGroup } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { createSettings } from "../../lib/api";

const FirstStep = () => {
  const router = useRouter();
  const [value, setValue] = useState("no");

  const handleNextPage = async () => {
    await createSettings({ includeId: value === "yes" });

    router.push("/setup/2");
  };

  return (
    <Grid container spacing={1}>
      <Grid item>
        <Typography variant="h2" gutterBottom>
          First Time Setup
        </Typography>
      </Grid>

      <Grid item xs={8}>
        <Typography>
          When submitting data, would you like to include an anonymous ID to
          better assist researchers? This ID will be attached with each uploaded
          sentence in an effort to better model the data. If you don’t include
          this ID, your sentences will be added to a global pool with no
          information that can be used to correlate them.
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
              label="Yes, include an anonymous ID"
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="No, don't include an anonymous ID"
            />
          </RadioGroup>
        </FormControl>
      </Grid>

      <Button variant="contained" color="primary" onClick={handleNextPage}>
        Next
      </Button>
    </Grid>
  );
};

export default FirstStep;
