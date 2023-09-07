type User = {
  id?: string;
  lastName: string;
  firstName: string;
  email: string;
  emailVerified?: string;
  companyId: string;
  roleId: string;
  image?: string;
  siteNumber?: string;
  enabled: boolean;
  deleted: boolean;
};

export const upsertUserTransformation = (user: User) => {
  const where = { id: user.id ?? '' };
  const data = {
    data: {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      companyId: user.companyId,
      roleId: user.roleId,
      deleted: user.deleted,
      enabled: user.enabled,
    },
  };
  return { where, data };
};

export const deleteUserTransformation = (id: string) => {
  const where = { id };

  const data = { deleted: { set: true } };

  return { where, data };
};
