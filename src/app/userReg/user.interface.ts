
export interface IUserInterface {
    user_name?: string;
    user_password?: string;
    user_phone: string;
    user_district?: string;
    user_division?: string;
    user_address?: string;
    user_status?: 'active' | 'in-active';
    user_role?: 'customer' | 'admin';
}

export const userSearchableField = [
    "user_name",
    "user_phone",
    "user_district",
    "user_division",
    "user_address",
    "user_status",
    "user_role",
  ];