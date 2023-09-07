var Cookies = require('cookies');

const Recogidas = (req, res) => {
  if (req.method === 'GET') {
    const ck = Cookies(req);
    return res.status(200).json({ prod: process.env.GRAPHQL_URL });
  }
};

export default Recogidas;
