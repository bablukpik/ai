import { evalite } from "evalite";
import { createFakeUsers } from "./main.ts";

evalite("Create Fake Users", {
  data: async () => [
    {
      input: "Generate 5 fake users from the UK",
    },
  ],
  task: async (input) => {
    return createFakeUsers(input);
  },
  scorers: [],
});
