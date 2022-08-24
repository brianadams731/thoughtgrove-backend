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
exports.VotesDeck = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Deck_1 = require("./Deck");
let VotesDeck = class VotesDeck extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VotesDeck.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Boolean)
], VotesDeck.prototype, "isUpVote", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], VotesDeck.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], VotesDeck.prototype, "deckId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Deck_1.Deck, deck => deck.votes, {
        eager: false,
        onDelete: 'CASCADE',
        nullable: false
    }),
    __metadata("design:type", Deck_1.Deck)
], VotesDeck.prototype, "deck", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.votesDeck, {
        eager: false,
        onDelete: 'CASCADE',
        nullable: false
    }),
    __metadata("design:type", User_1.User)
], VotesDeck.prototype, "user", void 0);
VotesDeck = __decorate([
    (0, typeorm_1.Entity)()
], VotesDeck);
exports.VotesDeck = VotesDeck;
