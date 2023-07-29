import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { billsValidationSchema } from 'validationSchema/bills';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.bills
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBillsById();
    case 'PUT':
      return updateBillsById();
    case 'DELETE':
      return deleteBillsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBillsById() {
    const data = await prisma.bills.findFirst(convertQueryToPrismaUtil(req.query, 'bills'));
    return res.status(200).json(data);
  }

  async function updateBillsById() {
    await billsValidationSchema.validate(req.body);
    const data = await prisma.bills.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBillsById() {
    const data = await prisma.bills.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
