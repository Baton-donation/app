import React from "react";
import { Typography, Paper } from "@material-ui/core";

const PrivacyDetailsText = () => (
  <Paper style={{ maxHeight: "50vh", overflow: "scroll", padding: "1rem" }}>
    <Typography gutterBottom>
      Before we upload your data, we encrypt it for anonymous delivery to our
      cloud server in what is known as a sealed box. This process uses our
      project&apos;s public encryption key. Our private key is needed to read
      any of your data.
    </Typography>

    <Typography gutterBottom>
      We store our private key separately on a non-networked device. This
      ensures even if our cloud server were hacked, your uploaded data could not
      be read. We periodically retrieve data from the cloud server, decrypting
      it locally.
    </Typography>

    <Typography gutterBottom>
      For each sentence you upload, our application stores a unique random ID on
      your computer. This unique ID allows you to delete any sentences you may
      have uploaded accidentally.
    </Typography>
  </Paper>
);

export default PrivacyDetailsText;
