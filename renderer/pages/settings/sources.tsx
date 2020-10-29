import React from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

const SourcesSettings = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={5}>
          <Grid item>
            <Typography variant="h2">Sources</Typography>
          </Grid>

          <Grid item>
            <IconButton aria-label="add source" color="primary">
              <AddIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} />

      <Grid item xs={6}>
        <TableContainer component={Paper}>
          <Table aria-label="sources list">
            <TableHead>
              <TableRow>
                <TableCell>App</TableCell>
                <TableCell>File location</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Dasher</TableCell>
                <TableCell>C:\\...</TableCell>
                <TableCell>
                  <IconButton aria-label="delete" color="secondary">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

SourcesSettings.breadcrumb = {
  name: "back to settings",
  href: "/settings",
};

export default SourcesSettings;
