/* mock/list.js */
// https://github.com/jaywcjlove/mocker-api
module.exports = {
    'GET /list': (req, res) => {
        res.json([1, 2, 3, 4]);
    },
};
