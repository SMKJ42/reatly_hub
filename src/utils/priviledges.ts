export type RealtyHubRole =
  | "admin"
  | "super-admin"
  | "owner"
  | "user"
  | "author";

const UserRoles = ["owner", "super-admin", "admin", "author", "user"] as const;

UserRoles.includes = (role: RealtyHubRole): boolean => {
  switch (role) {
    case "owner":
      return true;
    case "super-admin":
      return true;
    case "admin":
      return true;
    case "author":
      return true;
    case "user":
      return true;
    default:
      return false;
  }
};

const AuthorRoles = ["owner", "super-admin", "admin", "author"];

AuthorRoles.includes = (role: RealtyHubRole): boolean => {
  switch (role) {
    case "owner":
      return true;
    case "super-admin":
      return true;
    case "admin":
      return true;
    case "author":
      return true;
    default:
      return false;
  }
};

const AdminRoles = ["owner", "super-admin", "admin"];

AdminRoles.includes = (role: RealtyHubRole): boolean => {
  console.log("entering switch statement");
  switch (role) {
    case "owner":
      return true;
    case "super-admin":
      return true;
    case "admin":
      return true;
    default:
      return false;
  }
};

const OwnerRoles = ["owner"];

OwnerRoles.includes = (role: RealtyHubRole): boolean => {
  if (role === "owner") {
    return true;
  }
  return false;
};

export { UserRoles, AuthorRoles, AdminRoles, OwnerRoles };
