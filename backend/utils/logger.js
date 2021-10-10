"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LoggerService = void 0;
/* eslint-disable no-console */
const fs = require("fs");
const common_1 = require("./common");
class LoggerService {
    constructor() {
        this.common = common_1.Common;
        this.log = (msgJSON, selNode = this.common.selectedNode) => {
            let msgStr = '\r\n[' + new Date().toLocaleString() + '] ' + msgJSON.level + ': ' + msgJSON.fileName + ' => ' + msgJSON.msg;
            switch (msgJSON.level) {
                case 'ERROR':
                    if (selNode) {
                        if (msgJSON.error) {
                            msgStr = msgStr + ': ' + (typeof msgJSON.error === 'object' ? JSON.stringify(msgJSON.error) : (typeof msgJSON.error === 'string') ? msgJSON.error : '');
                        }
                        else {
                            msgStr = msgStr + '.';
                        }
                        console.error(msgStr);
                        if (selNode.log_file) {
                            fs.appendFile(selNode.log_file, msgStr, () => { });
                        }
                    }
                    break;
                case 'WARN':
                    if (selNode && (selNode.log_level === 'INFO' || selNode.log_level === 'WARN' || selNode.log_level === 'DEBUG')) {
                        if (msgJSON.data) {
                            msgStr = msgStr + ': ' + (typeof msgJSON.data === 'object' ? JSON.stringify(msgJSON.data) : (typeof msgJSON.data === 'string') ? msgJSON.data : '');
                        }
                        else {
                            msgStr = msgStr + '.';
                        }
                        console.warn(msgStr);
                        if (selNode.log_file) {
                            fs.appendFile(selNode.log_file, msgStr, () => { });
                        }
                    }
                    break;
                case 'DEBUG':
                    if (selNode && selNode.log_level === 'DEBUG') {
                        if (typeof msgJSON.data !== 'string' && msgJSON.data && msgJSON.data.length && msgJSON.data.length > 0) {
                            msgStr = msgJSON.data.reduce((accumulator, dataEle) => accumulator + (typeof dataEle === 'object' ? JSON.stringify(dataEle) : (typeof dataEle === 'string') ? dataEle : '') + ', ', msgStr + ': [');
                            msgStr = msgStr.slice(0, -2) + ']';
                        }
                        else {
                            if (msgJSON.data && msgJSON.data !== '') {
                                msgStr = msgStr + ': ' + (typeof msgJSON.data === 'object' ? JSON.stringify(msgJSON.data) : typeof msgJSON.data === 'string' ? msgJSON.data : '');
                            }
                            else {
                                msgStr = msgStr + '.';
                            }
                        }
                        console.log(msgStr);
                        if (selNode.log_file) {
                            fs.appendFile(selNode.log_file, msgStr, () => { });
                        }
                    }
                    break;
                case 'INFO':
                    if (selNode) {
                        if (msgJSON.data) {
                            msgStr = msgStr + '. ' + (typeof msgJSON.data === 'object' ? JSON.stringify(msgJSON.data) : (typeof msgJSON.data === 'string') ? msgJSON.data : '');
                        }
                        else {
                            msgStr = msgStr + '.';
                        }
                        console.log(msgStr);
                    }
                    break;
                default:
                    console.log(msgStr, selNode);
                    break;
            }
        };
    }
}
exports.LoggerService = LoggerService;
;
exports.Logger = new LoggerService();