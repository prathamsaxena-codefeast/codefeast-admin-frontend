"use client";
import { RoleChangeDrawer } from "@/components/user-management/RoleChangeDrawer";
import { useUsers } from "@/hooks/use-users";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/types/user";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

export default function UserManagementPage() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>();
  const { users, loading } = useUsers();

  useEffect(() => {
    if (!user) return;
    setCurrentUser(user as User);
  }, [user]);

  const usersArray = useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [users]);

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    try {
      const response = await api.post("/edit-role", { newRole, userId });
      toast.success(response.data.message);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to change role");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020618]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020618]">
        <div className="bg-white/80 dark:bg-[#161b22]/80 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center border border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            You don't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020618] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user roles and permissions
          </p>
        </div>
        <div className="rounded-2xl shadow-xl bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 transition-all">
          {/* Header should be fixed */}
          <div className="rounded-t-2xl overflow-hidden border-b border-gray-200 dark:border-gray-700">
            <table className="min-w-full">
              <thead className="bg-gray-100 dark:bg-[#1e2633]">
                <tr>
                  {["User", "Email", "Role", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: "480px" }}>
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {usersArray.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1b222e] transition"
                  >
                    <td className="px-6 py-4 whitespace-nowrap flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.username}
                        {user.id === currentUser.id && (
                          <span className="ml-2 bg-blue-500/20 text-blue-500 text-xs font-medium px-2 py-0.5 rounded-md">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          user.role === "admin"
                            ? "bg-purple-500/20 text-purple-400"
                            : user.role === "moderator"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <RoleChangeDrawer
                        user={user}
                        currentUser={currentUser}
                        onRoleChange={handleRoleChange}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* BotTom stats */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          {
            label: "Total Users",
            value: users.length,
            color: "text-blue-500",
          },
          {
            label: "Admins",
            value: users.filter((u) => u.role === "admin").length,
            color: "text-purple-500",
          },
          {
            label: "Regular Users",
            value: users.filter((u) => u.role === "user").length,
            color: "text-green-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white/70 dark:bg-[#161b22]/70 backdrop-blur-md p-6 mx-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
          >
            <dt className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </dt>
            <dd
              className={`mt-1 text-3xl font-semibold ${stat.color} dark:${stat.color}`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </div>
    </div>
  );
}
