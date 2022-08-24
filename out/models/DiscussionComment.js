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
exports.DiscussionComment = void 0;
const typeorm_1 = require("typeorm");
const GroupDiscussion_1 = require("./GroupDiscussion");
const User_1 = require("./User");
let DiscussionComment = class DiscussionComment extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], DiscussionComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], DiscussionComment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", Number)
], DiscussionComment.prototype, "discussionId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => GroupDiscussion_1.GroupDiscussion, groupDiscussion => groupDiscussion.comments, {
        onDelete: "CASCADE",
        nullable: false
    }),
    __metadata("design:type", GroupDiscussion_1.GroupDiscussion)
], DiscussionComment.prototype, "discussion", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, userDiscussionComment => userDiscussionComment.authoredDiscussionComments, {
        onDelete: "CASCADE",
        nullable: false
    }),
    __metadata("design:type", User_1.User)
], DiscussionComment.prototype, "author", void 0);
DiscussionComment = __decorate([
    (0, typeorm_1.Entity)()
], DiscussionComment);
exports.DiscussionComment = DiscussionComment;
