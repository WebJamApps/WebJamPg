const fetchEnv = (variable: string) => {
  if (process.env[variable] === undefined) { // eslint-disable-line security/detect-object-injection
    throw new Error(`You must provide a value for environmental variable ${variable}`);
  }
  return process.env[variable];// eslint-disable-line security/detect-object-injection
};

export default { fetchEnv };
