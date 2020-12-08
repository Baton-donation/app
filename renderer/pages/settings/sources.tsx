import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import { deleteSource, getSources } from "../../lib/api";
import { IApp } from "../../lib/types";

const SourcesSettings = () => {
  const router = useRouter();
  const [sources, setSources] = useState<IApp[]>([]);

  const updateSources = () => getSources().then(setSources);

  const handleDeleteSource = async (id: number) => {
    await deleteSource(id);
    await updateSources();
  };

  useEffect(() => {
    updateSources();
  }, []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container alignItems="center" spacing={5}>
          <Grid item>
            <Typography variant="h2">Sources</Typography>
          </Grid>

          <Grid item>
            <Button
              aria-label="add source"
              color="primary"
              onClick={() => router.push("/settings/add-source")}
              startIcon={<AddIcon />}
            >
              add source
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12} />

      <Grid item xs={12}>
        <TableContainer component={Paper}>
          <Table aria-label="sources list">
            <TableHead>
              <TableRow>
                <TableCell>Source</TableCell>
                <TableCell>Data location</TableCell>
                <TableCell>Remove</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sources.map((source) => (
                <TableRow key={source.id}>
                  <TableCell>{source.name}</TableCell>
                  <TableCell>{source.path}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="delete"
                      color="secondary"
                      onClick={() => handleDeleteSource(source.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

SourcesSettings.breadcrumb = {
  name: "Settings",
  href: "/settings",
};

export default SourcesSettings;
