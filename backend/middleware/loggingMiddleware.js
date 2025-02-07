const morgan = require('morgan');

const developmentLogging = morgan('dev');

const productionLogging = morgan('combined');

module.exports = {
    developmentLogging,
    productionLogging
};
