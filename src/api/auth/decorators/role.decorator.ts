import { applyDecorators, SetMetadata, UseGuards } from "@nestjs/common";

import type { UserRoleEnum } from "../../../../generated/prisma/client";
import { RolesGuard } from "../guard";

export const ROLES_KEY = "roles";
export const Roles = (...roles: UserRoleEnum[]) =>
  SetMetadata(ROLES_KEY, roles);

export const AllowedRoles = (...roles: UserRoleEnum[]) => {
  return applyDecorators(Roles(...roles), UseGuards(RolesGuard));
};
