import type { NextApiRequest, NextApiResponse } from "next";
import type Error from "next/error";
import { client } from "~/utils/api";

// const transformer = {
//   input: SuperJSON,
//   output: {
//     serialize: (object) => {
//       uneval(object);
//     },
//     deserialize: (object) => eval(`(${object})`),
//   },
// };

const handler = (request: NextApiRequest, response: NextApiResponse) => {
  const key = (request.query.key as string) || "";
  function output() {
    client.mortgageRates.create
      .mutate({
        key: key,
        name: "test",
        rate: 5,
      })
      .then((res) => {
        // response.status(200).json(res);
        console.log(res);
      })
      .catch((err: Error) => {
        // response.status(500).json(err);
        console.log(err);
      });
  }
  output();
};

export default handler;
