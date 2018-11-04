/*
 * Create adn export configuration vars
 */

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
    "port" : 3000,
    "envName" : "staging"
};

// Production environment
environments.production = {
    "port" : 5000,
    "envName" : "production"
};

// Determine which environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) === "string" ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the current environment is one of the environments above, if not, default
const environmentToExport = typeof (environments[currentEnvironment]) === "object" ? environments[currentEnvironment] : environments.staging;

// export the module
module.exports = environmentToExport;