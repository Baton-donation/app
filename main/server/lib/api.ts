import got, { Got } from "got";

export interface ISentenceDto {
  content: string;
  anonymousUUID: string | null;
  uuid: string;
}

export default class APIClient {
  private client: Got;

  constructor() {
    this.client = got.extend({ prefixUrl: process.env.BASE_API_URL });
  }

  async submitSentences(sentences: ISentenceDto[]) {
    await this.client.post("sentences/many", { json: sentences });
  }

  async deleteSentence(uuid: string) {
    await this.client.delete(`sentences/${uuid}`);
  }

  async getPublicKey() {
    const { body } = await this.client.get("keys/public");

    return body;
  }

  async putUserDetails(body: { uuid: string; encryptedData: string }) {
    await this.client.post("user-details", { json: body });
  }

  async checkUnlockCode(code: string) {
    return this.client.get(`codes/validate/${code}`);
  }
}
