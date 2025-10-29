"use client";
import { RoleChangeDrawer } from "@/components/user-management/RoleChangeDrawer";
import { useUsers } from "@/hooks/use-users";
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

export default function UserManagementPage() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState<User | null>();
  const { users, loading, refetch } = useUsers();

  useEffect(() => {
    if (!user) return;
    setCurrentUser(user as User);
  }, [user]);

  const usersArray = useMemo(() => {
    return Array.isArray(users) ? users : [];
  }, [users]);

  const handleRoleChange = async (userId: string, newRole: User["role"]) => {
    try {
      const response = await api.post("/user", { newRole, userId });
      //refetching the whhole users data.
      refetch();
    } catch (err: any) {}
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

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#020618]">
        <div className="bg-white/80 dark:bg-[#020618]/80 backdrop-blur-md p-8 rounded-xl shadow-2xl text-center border border-gray-200 dark:border-gray-700">
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
        {/* Header (from your original code) */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage user roles and permissions
          </p>
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
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                        {user.username}
                        {user.email === currentUser.email && (
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
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        user.role === "admin"
                          ? "bg-purple-500/20 text-purple-400"
                          : user.role === "ta"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-gray-500/20 text-gray-400"
                      }`}
                    >
                      {user.role}
                    </span>
                  </TableCell>

                  <TableCell>
                    <RoleChangeDrawer
                      user={user}
                      currentUser={currentUser}
                      onRoleChange={handleRoleChange}
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
