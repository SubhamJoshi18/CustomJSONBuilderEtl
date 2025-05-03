import dotenv from "dotenv";
import { customJsonBuilderEtlLogger } from "../libs/logger";

const isEnvExists = (key: string) => {
  return Object.prototype.hasOwnProperty.call(process.env, key);
};

const getEnvValue = (key: string) => {
  try {
    return isEnvExists(key) ? process.env[key] : null;
  } catch (err) {
    customJsonBuilderEtlLogger.error(
      `Error getting the env value from the process.env`
    );
  }
};

export { getEnvValue };
