import { isSsr } from '../helpers/ssr';
import { UserRole } from '../types/models';

type Visitor = {
  name: string;
  email: string;
  roles: UserRole[];
};

export type TawkAPI = {
  visitor: Visitor;
  onLoad(): void;
  addTags(tags: UserRole[], callback?: () => void): void;
};


export function setVisitor(visitor: Visitor): void {
  if (!window.Tawk_API) {
    return;
  }
  window.Tawk_API.visitor = visitor;
}
