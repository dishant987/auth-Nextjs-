import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface ExtendedUser {
  id?: string;
  name: string;
  email: string;
  image: string;
  isTwoFactorEnabled?: boolean;
  role?: "ADMIN" | "USER";
}

interface UserInfoProps {
  user?: ExtendedUser;
  label: string;
  icon?: React.ReactNode;
}

export const UserInfo = ({ user, label, icon }: UserInfoProps) => {
  return (
    <Card className="w-[97%]">
      <CardHeader className="flex flex-col items-center ">
        <div className="flex items-center gap-2">
          {icon}
          <p className="text-2xl font-semibold">{label}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow">
          <p className="text-sm font-medium">ID</p>
          <p className=" truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-lg">
            {user?.id}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow">
          <p className="text-sm font-medium">Name</p>
          <p className=" truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-lg">
            {user?.name}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow">
          <p className="text-sm font-medium">Email</p>
          <p className=" truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-lg">
            {user?.email}
          </p>
        </div>
        <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow">
          <p className="text-sm font-medium">Role</p>
          <p className=" truncate text-xs max-w-[180px] font-mono p-1 bg-slate-200 rounded-lg">
            {user?.role}
          </p>
        </div>
        {!user?.image && (
          <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow">
            <p className="text-sm font-medium">Two Factor Authentication</p>
            <div
              className={`truncate text-xs max-w-[180px] font-mono p-1 px-3 rounded-lg ${
                user?.isTwoFactorEnabled
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user?.isTwoFactorEnabled ? "ON" : "OFF"}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
