
import { isMock } from '@/lib/utils';
import { createApiClient } from './api';
import { createMockClient } from './mocks';

export function getDataClient() {
  return isMock() ? createMockClient() : createApiClient();
}

export type DataClient = ReturnType<typeof createApiClient> | ReturnType<typeof createMockClient>;
