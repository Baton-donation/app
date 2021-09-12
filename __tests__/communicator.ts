import path from "path";
import Communicator from "../main/server/apps/communicator";

test("reads Communicator phrase file", async () => {
  const pathToTestFile = path.join(__dirname, "./communicator-test-data.phr");

  const communicator = new Communicator({
    location: pathToTestFile,
  });

  const phrases = await communicator.getText();

  expect(phrases).toBe(
    "Hello how are you I think it's over cooked.\nHello how are you\nHello\nHello, my name is this low carb?\nHi, this is delicious!"
  );
});
