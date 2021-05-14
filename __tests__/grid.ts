import path from "path";
import Grid from "../main/server/apps/grid";

test.only("reads data grid data from a grid file", async () => {
  // Arrange
  const pathToTestFile = path.join(__dirname, "./grid-test-data.sqlite");
  const gridDataSource = new Grid({
    name: "Grid",
    staticLocations: [pathToTestFile],
    gridRootDirectories: [],
  });

  // Act
  const phrases = await gridDataSource.getText();

  // Assert
  expect(phrases).toBe(
    `hey guys and a bit like this.\ni'm sorry that you have any queries.\ni'll get the best price you are looking to get.\ni'm sorry that this would like a plan.`
  );
});
