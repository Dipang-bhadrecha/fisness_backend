"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCompany = createCompany;
exports.getMyCompanies = getMyCompanies;
exports.getCompany = getCompany;
exports.updateCompany = updateCompany;
exports.deleteCompany = deleteCompany;
exports.addRegisteredBoat = addRegisteredBoat;
exports.getRegisteredBoats = getRegisteredBoats;
const company_service_1 = require("../services/company.service");
const response_1 = require("../utils/response");
async function createCompany(req, reply) {
    const company = await company_service_1.CompanyService.create(req.server.prisma, req.user.userId, req.body);
    return reply.status(201).send((0, response_1.successResponse)(company, 'Company created'));
}
async function getMyCompanies(req, reply) {
    const companies = await company_service_1.CompanyService.getAll(req.server.prisma, req.user.userId);
    return reply.send((0, response_1.successResponse)(companies));
}
async function getCompany(req, reply) {
    const company = await company_service_1.CompanyService.getOne(req.server.prisma, req.user.userId, req.params.companyId);
    return reply.send((0, response_1.successResponse)(company));
}
async function updateCompany(req, reply) {
    const company = await company_service_1.CompanyService.update(req.server.prisma, req.user.userId, req.params.companyId, req.body);
    return reply.send((0, response_1.successResponse)(company, 'Company updated'));
}
async function deleteCompany(req, reply) {
    await company_service_1.CompanyService.remove(req.server.prisma, req.user.userId, req.params.companyId);
    return reply.send((0, response_1.successResponse)(null, 'Company deleted'));
}
async function addRegisteredBoat(req, reply) {
    const boat = await company_service_1.CompanyService.addRegisteredBoat(req.server.prisma, req.user.userId, req.params.companyId, req.body);
    return reply.status(201).send((0, response_1.successResponse)(boat, 'Boat registered'));
}
async function getRegisteredBoats(req, reply) {
    const boats = await company_service_1.CompanyService.getRegisteredBoats(req.server.prisma, req.user.userId, req.params.companyId);
    return reply.send((0, response_1.successResponse)(boats));
}
