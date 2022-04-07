export enum ActionType {
  VIEW = 'View',
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete',
}

export enum ActionScope {
  ALL = 'Any',
  OWN = 'Own',
}

export function getPermName(
  action: ActionType,
  scope: ActionScope,
  name: string,
): string {
  return action.toString() + ' ' + scope.toString() + ' ' + name;
}
