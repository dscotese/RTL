"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePeer = exports.postPeer = exports.getPeers = void 0;
const request = require("request-promise");
const logger_1 = require("../../utils/logger");
const common_1 = require("../../utils/common");
let options = null;
const logger = logger_1.Logger;
const common = common_1.Common;
const getPeers = (req, res, next) => {
    logger.log({ level: 'INFO', fileName: 'Peers', msg: 'List Peers..' });
    options = common.getOptions();
    options.url = common.getSelLNServerUrl() + '/v1/peer/listPeers';
    request(options).then((body) => {
        body.forEach((peer) => {
            if (!peer.alias || peer.alias === '') {
                peer.alias = peer.id.substring(0, 20);
            }
        });
        const peers = (body) ? common.sortDescByStrKey(body, 'alias') : [];
        logger.log({ level: 'DEBUG', fileName: 'Peers', msg: 'Peers with Alias', data: peers });
        logger.log({ level: 'INFO', fileName: 'Peers', msg: 'Peers Received' });
        res.status(200).json(peers);
    }).catch((errRes) => {
        const err = common.handleError(errRes, 'Peers', 'List Peers Error');
        return res.status(err.statusCode).json({ message: err.message, error: err.error });
    });
};
exports.getPeers = getPeers;
const postPeer = (req, res, next) => {
    logger.log({ level: 'INFO', fileName: 'Peers', msg: 'Connecting Peer..' });
    options = common.getOptions();
    options.url = common.getSelLNServerUrl() + '/v1/peer/connect';
    options.body = req.body;
    request.post(options).then((body) => {
        logger.log({ level: 'DEBUG', fileName: 'Peers', msg: 'Peer Added', data: body });
        options.url = common.getSelLNServerUrl() + '/v1/peer/listPeers';
        request(options).then((body) => {
            let peers = (body) ? common.sortDescByStrKey(body, 'alias') : [];
            peers = common.newestOnTop(peers, 'id', req.body.id);
            logger.log({ level: 'DEBUG', fileName: 'Peers', msg: 'Peer with Newest On Top', data: peers });
            logger.log({ level: 'DEBUG', fileName: 'Peers', msg: 'Peer Added Successfully' });
            logger.log({ level: 'INFO', fileName: 'Peers', msg: 'Peer Connected' });
            res.status(201).json(peers);
        }).catch((errRes) => {
            const err = common.handleError(errRes, 'Peers', 'Connect Peer Error');
            return res.status(err.statusCode).json({ message: err.message, error: err.error });
        });
    }).catch((errRes) => {
        const err = common.handleError(errRes, 'Peers', 'Connect Peer Error');
        return res.status(err.statusCode).json({ message: err.message, error: err.error });
    });
};
exports.postPeer = postPeer;
const deletePeer = (req, res, next) => {
    logger.log({ level: 'INFO', fileName: 'Peers', msg: 'Disconnecting Peer..' });
    options = common.getOptions();
    options.url = common.getSelLNServerUrl() + '/v1/peer/disconnect/' + req.params.peerId + '?force=' + req.query.force;
    request.delete(options).then((body) => {
        logger.log({ level: 'DEBUG', fileName: 'Peers', msg: 'Detach Peer Response', data: body });
        logger.log({ level: 'DEBUG', fileName: 'Peers', msg: 'Peer Detached', data: req.params.peerId });
        logger.log({ level: 'INFO', fileName: 'Peers', msg: 'Peer Disconnected' });
        res.status(204).json({});
    }).catch((errRes) => {
        const err = common.handleError(errRes, 'Peers', 'Detach Peer Error');
        return res.status(err.statusCode).json({ message: err.message, error: err.error });
    });
};
exports.deletePeer = deletePeer;