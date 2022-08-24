"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDeckRelation = void 0;
const mapDeckRelation = (deck, user) => {
    if (!user) {
        return "guest";
    }
    if (deck.user.id === user.id) {
        return "owner";
    }
    else if (deck.user.id !== user.id) {
        return "guest";
    }
    else {
        return "error";
    }
};
exports.mapDeckRelation = mapDeckRelation;
