"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Deck = void 0;
const typeorm_1 = require("typeorm");
const Card_1 = require("./Card");
const CommentDeck_1 = require("./CommentDeck");
const User_1 = require("./User");
const VotesDeck_1 = require("./VotesDeck");
let Deck = class Deck extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Deck.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Deck.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Deck.prototype, "subject", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], Deck.prototype, "voteCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Deck.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, default: true }),
    __metadata("design:type", Boolean)
], Deck.prototype, "public", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.decks, {
        eager: false,
        onDelete: 'CASCADE', // When user gets deleted, the deck will be deleted
    }),
    __metadata("design:type", User_1.User)
], Deck.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Card_1.Card, card => card.deck, {
        eager: false,
        cascade: ["insert"] // When cards get inserted into the deck, they will atuomatically be inserted in card table
    }),
    __metadata("design:type", Array)
], Deck.prototype, "cards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CommentDeck_1.CommentDeck, commentDeck => commentDeck.deck, {
        eager: false,
        cascade: ["insert"] // When comments get inserted into deck, they will be automatically inserted into comment table
    }),
    __metadata("design:type", Array)
], Deck.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => VotesDeck_1.VotesDeck, votesDeck => votesDeck.deck, {
        eager: false,
        cascade: ["insert"]
    }),
    __metadata("design:type", Array)
], Deck.prototype, "votes", void 0);
Deck = __decorate([
    (0, typeorm_1.Entity)()
], Deck);
exports.Deck = Deck;
