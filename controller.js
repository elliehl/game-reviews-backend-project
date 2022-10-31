const fs = require("fs/promises");

const getEndpoints = (req, res, next) => {
  fs.readFile("./endpoints.json", "utf-8")
    .then((endpointsResponse) => {
      const parsedEndpoints = JSON.parse(endpointsResponse);
      const endpoints = { endpoints: parsedEndpoints };
      res.status(200).send(endpoints);
      res.end();
    })
    .catch(next);
};

module.exports = { getEndpoints };

// endpoints.json is essentially a documentation of what each endpoint does
// need to be 9 total
// example request/body for patch and post
