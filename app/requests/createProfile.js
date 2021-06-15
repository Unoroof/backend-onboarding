const validatorBase = require('./base');

const constraints = {
    type: {
        presence: true,
    },
    data: {
        presence: true,
    },
    status: {
        presence: true
    }
}

module.exports = (...props) => {
    return validatorBase(constraints, ...props);
}