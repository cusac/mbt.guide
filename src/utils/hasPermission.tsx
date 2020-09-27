import { intersection } from 'lodash';

export default function hasPermission({
  currentScope,
  requiredScope,
}: {
  currentScope: string[];
  requiredScope: string[];
}): boolean {
  return intersection(currentScope, [...requiredScope, 'root']).length > 0;
}
