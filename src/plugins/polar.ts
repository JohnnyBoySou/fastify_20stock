import { PolarAPI, Configuration, } from "@polar-sh/sdk";

const config = new Configuration({
    accessToken: process.env.POLAR_ACCESS_TOKEN as string,
    basePath: process.env.POLAR_BASE_URL as string,
});

export const Polar = new PolarAPI(config);
