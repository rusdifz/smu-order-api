import { UserIdentity } from '@wings-online/common';
import { CorrelatableCommand, WithIdentity } from '@wo-sdk/core';

export class ChangeOrderCommandProps implements WithIdentity<UserIdentity> {
  readonly identity: UserIdentity;
  readonly id: number;
}

export class ChangeOrderCommand extends CorrelatableCommand<ChangeOrderCommandProps> {
  constructor(data: ChangeOrderCommandProps) {
    super(data);
  }
}
