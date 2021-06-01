import path from "path";
import Grid from "../main/server/apps/grid";

test("reads data grid data from a grid file", async () => {
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

test("Only adds full stops to phrases that don't have any punctuation at the end.", async () => {
  // Arrange
  const pathToTestFile = path.join(
    __dirname,
    "./grid-history-with-full-stops.sqlite"
  );
  const gridDataSource = new Grid({
    name: "Grid",
    staticLocations: [pathToTestFile],
    gridRootDirectories: [],
  });

  // Act
  const phrases = await gridDataSource.getText();

  // Assert
  expect(phrases).toBe(`i need to buy tickets.
i would like to go by train.
can you help me please?
get help now!
i doubt that.
what is next?
what's your favourite music?
i am going to eat food with my  friend for her happy birthday!
what is your name?
when is your birthday?
i am asking a question.
i feel happy.`);
});
