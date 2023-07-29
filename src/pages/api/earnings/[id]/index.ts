import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { earningsValidationSchema } from 'validationSchema/earnings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.earnings
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getEarningsById();
    case 'PUT':
      return updateEarningsById();
    case 'DELETE':
      return deleteEarningsById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getEarningsById() {
    const data = await prisma.earnings.findFirst(convertQueryToPrismaUtil(req.query, 'earnings'));
    return res.status(200).json(data);
  }

  async function updateEarningsById() {
    await earningsValidationSchema.validate(req.body);
    const data = await prisma.earnings.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteEarningsById() {
    const data = await prisma.earnings.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
