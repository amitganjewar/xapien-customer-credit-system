import { api } from './mockApi';

test('mockApi.listCustomers returns array', async () => {
  const list = await api.listCustomers();
  expect(Array.isArray(list)).toBe(true);
});