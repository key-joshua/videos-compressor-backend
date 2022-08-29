const Router = require("express");
const videoCompressRouter = require("./videoCompressRoute.js");

const router = Router();
router.use('/video', videoCompressRouter);

module.exports = router;
