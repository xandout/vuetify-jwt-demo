module.exports = {
    get: (req, res) => {
        let result = {};
        let status = 200;
        result.user = req.session.user_id;
        res.status(status).send(result);
    }
}