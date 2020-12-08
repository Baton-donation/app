import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import WarningIcon from "@material-ui/icons/Warning";

const PIIWarningIcon = () => (
  <Tooltip title="This sentence may include personal information">
    <WarningIcon color="error" />
  </Tooltip>
);

export default PIIWarningIcon;
