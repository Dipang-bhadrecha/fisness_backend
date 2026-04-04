"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyRoutes = companyRoutes;
const company_controller_1 = require("../controllers/company.controller");
async function companyRoutes(fastify) {
    const auth = { preHandler: [fastify.authenticate] };
    fastify.get('/', auth, company_controller_1.getMyCompanies);
    fastify.post('/', auth, company_controller_1.createCompany);
    fastify.get('/:companyId', auth, company_controller_1.getCompany);
    fastify.patch('/:companyId', auth, company_controller_1.updateCompany);
    fastify.delete('/:companyId', auth, company_controller_1.deleteCompany);
    fastify.post('/:companyId/registered-boats', auth, company_controller_1.addRegisteredBoat);
    fastify.get('/:companyId/registered-boats', auth, company_controller_1.getRegisteredBoats);
}
//# sourceMappingURL=company.routes.js.map