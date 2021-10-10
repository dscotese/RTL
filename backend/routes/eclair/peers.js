"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authCheck_1 = require("../../utils/authCheck");
const peers_1 = require("../../controllers/eclair/peers");
const router = express_1.Router();
router.get('/', authCheck_1.isAuthenticated, peers_1.getPeers);
router.post('/', authCheck_1.isAuthenticated, peers_1.connectPeer);
router.delete('/:nodeId', authCheck_1.isAuthenticated, peers_1.deletePeer);
exports.default = router;