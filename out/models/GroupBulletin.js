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
exports.GroupBulletin = void 0;
const typeorm_1 = require("typeorm");
const Group_1 = require("./Group");
let GroupBulletin = class GroupBulletin extends typeorm_1.BaseEntity {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], GroupBulletin.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], GroupBulletin.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Group_1.Group, group => group.bulletins, {
        onDelete: "CASCADE",
        nullable: false
    }),
    __metadata("design:type", Group_1.Group)
], GroupBulletin.prototype, "group", void 0);
GroupBulletin = __decorate([
    (0, typeorm_1.Entity)()
], GroupBulletin);
exports.GroupBulletin = GroupBulletin;
