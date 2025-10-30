/*import { PolarAPI, Configuration, } from "@polar-sh/sdk";

const config = new Configuration({
    accessToken: process.env.POLAR_ACCESS_TOKEN as string,
    basePath: process.env.POLAR_BASE_URL as string,
});

//export const Polar = new PolarAPI(config);
*/

import { Polar } from "@polar-sh/sdk";

export const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_KEY as string,
    server:  "sandbox" //"sandbox") as "production" | "sandbox"
});

