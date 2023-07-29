import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { paymentsValidationSchema } from 'validationSchema/payments';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.payments
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getPaymentsById();
    case 'PUT':
      return updatePaymentsById();
    case 'DELETE':
      return deletePaymentsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getPaymentsById() {
    const data = await prisma.payments.findFirst(convertQueryToPrismaUtil(req.query, 'payments'));
    return res.status(200).json(data);
  }

  async function updatePaymentsById() {
    await paymentsValidationSchema.validate(req.body);
    const data = await prisma.payments.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deletePaymentsById() {
    const data = await prisma.payments.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
