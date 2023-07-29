const mapping: Record<string, string> = {
  bills: 'bills',
  earnings: 'earnings',
  organizations: 'organization',
  payments: 'payments',
  savings: 'savings',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
