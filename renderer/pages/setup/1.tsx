import React, { useState } from "react";
import { useRouter } from "next/router";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Backdrop from "@material-ui/core/Backdrop";
import Container from "@material-ui/core/Container";
import ConsentText from "../../components/consent";
import PrivacyDetailsText from "../../components/privacy-details";

const FirstStep = () => {
  const router = useRouter();
  const [showPrivacyDetails, setShowPrivacyDetails] = useState(false);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography variant="h2" gutterBottom>
            Get set up
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <ConsentText />
        </Grid>

        <Grid item xs={12} container>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/setup/2")}
          >
            Agree and continue
          </Button>

          <Button
            style={{ marginLeft: "auto" }}
            onClick={() => setShowPrivacyDetails(true)}
          >
            Privacy Details
          </Button>
        </Grid>
      </Grid>

      <Backdrop
        open={showPrivacyDetails}
        onClick={() => setShowPrivacyDetails(false)}
        style={{ zIndex: 10 }}
      >
        <Container maxWidth="sm">
          <PrivacyDetailsText />
        </Container>
      </Backdrop>
    </>
  );
};

export default FirstStep;
