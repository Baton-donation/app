import React, { useState } from "react";
import {
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  Paper,
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormLabel,
  FormControl,
} from "@material-ui/core";
import { useRouter } from "next/router";
import { uploadUserDetails } from "../../lib/api";

const ThirdStep = () => {
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [gender, setGender] = useState("");
  const [software, setSoftware] = useState("");
  const [softwareAge, setSoftwareAge] = useState("");
  const [devices, setDevices] = useState("");

  const router = useRouter();

  const handleNext = async () => {
    const data = {
      age,
      condition,
      gender,
      software,
      softwareAge,
      devices,
    };

    await uploadUserDetails(data);

    router.push("/setup/4");
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Typography variant="h2" gutterBottom>
          Get set up
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <Typography>All questions are optional.</Typography>
      </Grid>

      <Grid item xs={12}>
        <Paper>
          <List>
            <ListItem>
              <TextField
                fullWidth
                label="How old are you?"
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </ListItem>

            <ListItem>
              <FormControl component="fieldset" style={{ marginTop: "1rem" }}>
                <FormLabel component="legend">
                  How would you describe your gender?
                </FormLabel>
                <RadioGroup
                  aria-label="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="Prefer not to answer"
                  />
                </RadioGroup>
              </FormControl>
            </ListItem>

            <ListItem>
              <TextField
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                name="condition"
                fullWidth
                label="What condition leads you to use Augmentative and Alternative Communication (AAC)?"
              />
            </ListItem>

            <ListItem>
              <TextField
                value={software}
                onChange={(e) => setSoftware(e.target.value)}
                fullWidth
                label="What software did you use to write the sentences you plan to contribute?"
              />
            </ListItem>

            <ListItem>
              <TextField
                value={softwareAge}
                onChange={(e) => setSoftwareAge(e.target.value)}
                fullWidth
                label="How long have you been using this software?"
              />
            </ListItem>

            <ListItem>
              <TextField
                value={devices}
                onChange={(e) => setDevices(e.target.value)}
                fullWidth
                label="What devices do you use to input to your computer (for example: mouse, head tracker, eye tracker)?"
              />
            </ListItem>
          </List>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleNext}>
          Next
        </Button>
      </Grid>
    </Grid>
  );
};

export default ThirdStep;
