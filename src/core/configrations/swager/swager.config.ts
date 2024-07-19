import { readEnv } from "../../../core/helpers/env.helper";

export const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: `${readEnv("APP_NAME")} API`,
      version: "v1",
      description: `${readEnv("APP_NAME")} API Description`,
      contact: {
        name: "Contact",
        email: "mostafaelgmal36@gmail.com",
        url: "https://github.com/MustafaElgmal",
      },
      license: {
        name: "Developed by Mustafa Elgmal",
        url: "https://github.com/MustafaElgmal",
      },
    },
    servers: [
      {
        url: readEnv("APP_HOST"),
      },
    ],
    components: {
      securitySchemes: {
        bearer: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    "src/modules/property/*.ts",
    "src/modules/support/*.ts",
    "src/modules/unit/*.ts",
    "src/modules/working_area/*.ts",
  ],
};
