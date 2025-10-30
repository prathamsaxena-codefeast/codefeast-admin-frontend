"use client";

import { useState } from "react";
import { User } from "@/types/user";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Eye, EyeOff } from "lucide-react";

export function RoleChangeDrawer({
  user,
  currentUser,
  onRoleChange,
  onPasswordReset,
  onDeleteUser,
}: {
  user: User;
  currentUser: User;
  onRoleChange: (userId: User["_id"], newRole: User["role"]) => void;
  onPasswordReset: (userId: User["_id"], newPassword: string) => void;
  onDeleteUser: (userId: User["_id"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [newPassword, setNewPassword] = useState("");
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  if (user.email === currentUser.email) {
    return (
      <span className="text-gray-400 dark:text-gray-500 text-sm">
        Cannot take actions here.
      </span>
    );
  }

  const togglePasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleSave = () => {
    let hasChanges = false;

    if (selectedRole !== user.role) {
      onRoleChange(user._id, selectedRole);
      hasChanges = true;
    }

    if (newPassword.trim() !== "") {
      onPasswordReset(user._id, newPassword.trim());
      hasChanges = true;
    }

    if (hasChanges) {
      setNewPassword("");
    }

    setIsResettingPassword(false);
    setOpen(false);
    setShowNewPassword(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset state if sheet is closed without saving
      setSelectedRole(user.role);
      setNewPassword("");
      setIsResettingPassword(false);
      setIsDeleteAlertOpen(false);
      setShowNewPassword(false);
    }
    setOpen(isOpen);
  };

  const handleConfirmDelete = () => {
    onDeleteUser(user._id);
    setIsDeleteAlertOpen(false);
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="default"
        onClick={() => setOpen(true)}
        className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1e2633] dark:to-[#1b222e] text-gray-800 dark:text-gray-100 px-4 py-1 rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all"
      >
        Take Actions
      </Button>

      <Sheet open={open} onOpenChange={handleOpenChange}>
        <SheetContent
          side="right"
          className="w-[340px] sm:w-[400px] border-l border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-xl"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">Edit User</SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              Update role or reset password for{" "}
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {user.name}
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Change Role
              </label>
              <Select
                value={selectedRole}
                onValueChange={(selectedRole: string) =>
                  setSelectedRole(selectedRole as User["role"])
                }
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Choose a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="ta">TA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div>
              {isResettingPassword ? (
                <>
                  <label
                    htmlFor="new-password"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Reset Password
                  </label>
                  <div className="relative w-full mt-2">
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password..."
                      className="w-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-1 hover:bg-transparent"
                      onClick={togglePasswordVisibility}
                      aria-label={
                        showNewPassword
                          ? "Hide new password"
                          : "Show new password"
                      }
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setIsResettingPassword(true)}
                >
                  Reset Password
                </Button>
              )}
            </div>
            <Button
              className="w-full"
              onClick={handleSave}
              disabled={selectedRole === user.role && newPassword.trim() === ""}
            >
              Save Changes
            </Button>
          </div>

          <Separator />

          <div>
            <Button
              variant="destructive"
              className="w-full mt-90"
              onClick={() => setIsDeleteAlertOpen(true)}
            >
              Delete User
            </Button>
          </div>

          <AlertDialog
            open={isDeleteAlertOpen}
            onOpenChange={setIsDeleteAlertOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete{" "}
                  <span className="font-medium text-gray-800 dark:text-gray-100">
                    {user.name}
                  </span>
                  's account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#9f4246] hover:bg-[#ba595e] text-white"
                  onClick={handleConfirmDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </SheetContent>
      </Sheet>
    </>
  );
}
