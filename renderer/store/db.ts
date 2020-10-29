import Dexie from "dexie";
import { Sentence } from "./sentences/types";

class BatonDatabase extends Dexie {
  sentences: Dexie.Table<Sentence, number>;

  constructor(databaseName: string) {
    super(databaseName);
    this.version(1).stores({
      sentences: "++id,content,willSubmit,viewed",
    });
    this.sentences = this.table("sentences");
  }
}

export const db = new BatonDatabase("sentences");
