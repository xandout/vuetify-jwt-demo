module.exports = {
    get: (req, res) => {
        let result = {};
        let status = 200;
        const payload = req.decoded;
        result.user = payload.user;
        res.status(status).send(result);
    }
}