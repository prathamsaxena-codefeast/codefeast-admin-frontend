"use client";
import { RoleChangeDrawer } from "@/components/user-management/RoleChangeDrawer";
import { useUsers } from "@/hooks/use-users";
import { CreateUserDialog } from "@/components/user-management/CreateUserDialog";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { User } from "@/types/user";
import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function UserManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>();
  const { users, loading, refetch } = useUsers();

  useEffect(() => {
    if (!user) return;
    setCurrentUser(user as unknown as User);
  }, [user]);

  let usersArray = useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [users]);

  const handleRoleChange = async (
    userId: User["_id"],
    newRole: User["role"]
  ) => {
    try {
      const response = await api.post("/user", { newRole, userId });
      toast.success("Role changed successfully", {
        description: response.data.message,
      });

      //refetching the whhole users data.
      refetch();
    } catch (err: any) {
      toast.error("Error while resetting the password", {
        description: err.message,
      });
    }
  };

  const handlePasswordChange = async (
    userId: User["_id"],
    newPassword: string
  ) => {
    try {
      const response = await api.post("/user/reset-password", {
        userId,
        newPassword,
      });
      toast.success("Password reset successfully", {
        description: response.data.message,
      });
    } catch (err: any) {
      toast.error("Error while resetting the password", {
        description: err.message,
      });
    }
  };

  const handleDeleteUser = async (userId: User["_id"]) => {
    try {
      const response = await api.post("/user/delete-user", { userId });

      toast.success("User removed successfully", {
        description: response.data.message,
      });
      refetch();
    } catch (err: any) {
      toast.error("Error while resetting the password", {
        description: err.message,
      });
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page

  const totalPages = Math.ceil(usersArray.length / rowsPerPage);
  const paginatedUsers = usersArray.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020618]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#020618] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage user roles and permissions
              </p>
            </div>
            <CreateUserDialog onUserCreated={refetch} />
          </div>
        </div>

        <div className="rounded-md border bg-white dark:bg-[#020618] border-gray-200 dark:border-gray-700">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap">User</TableHead>
                <TableHead className="whitespace-nowrap">Email</TableHead>
                <TableHead className="whitespace-nowrap">Role</TableHead>
                <TableHead className="whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-gray-50 dark:hover:bg-[#1b222e]"
                >
                  <TableCell>
                    <div className="flex items-center">
                      <div className="ml-2 py-1 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.name}
                        {user.email === currentUser!.email && (
                          <span className="ml-2 bg-blue-500/20 text-blue-500 text-xs font-medium px-2 py-0.5 rounded-md">
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize`}
                    >
                      {user.role}
                    </span>
                  </TableCell>

                  <TableCell>
                    <RoleChangeDrawer
                      user={user}
                      currentUser={currentUser!}
                      onRoleChange={handleRoleChange}
                      onPasswordReset={handlePasswordChange}
                      onDeleteUser={handleDeleteUser}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-2 py-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {paginatedUsers.length} of {usersArray.length} user(s) displayed.
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Rows per page
              </p>
              <label htmlFor="rowsPerPage" className="sr-only">
                Rows per page
              </label>
              <select
                id="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="h-8 w-[70px] rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#020618] px-3 py-1 text-sm text-gray-900 dark:text-white"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>

            <div className="flex w-[100px] items-center justify-center text-sm font-medium text-gray-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              >
                <ChevronFirst className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              >
                <ChevronLast className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
