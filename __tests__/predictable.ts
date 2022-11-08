import path from "path";
import PlainText from "../main/server/apps/plain-text";
import { processPredictableFile } from "../main/server/apps/predictable";

test("reads data grid data from a predictable file", async () => {
  // Arrange
  const pathToTestFile = path.join(__dirname, "./Predictable-test-data.json");
  const predictableDataSource = new PlainText({
    locations: [pathToTestFile],
    processFile: processPredictableFile,
  });

  // Act
  const phrases = await predictableDataSource.getText();

  // Assert
  expect(phrases).toBe(
    `We You are a number that is was the first place and I Yes Yes yes and.
Yes.
We You are a number that is was.
No.
Yes.
No.
Yes.
We were in able the and same with.
Yes.
We were in able the and same with.
We were in able the and same with.
The fact of course you are a number.
History 2.
History 1.`
  );
});
