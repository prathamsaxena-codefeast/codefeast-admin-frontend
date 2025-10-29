"use client";

import { useState, useEffect } from "react";
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

export function RoleChangeDrawer({
  user,
  currentUser,
  onRoleChange,
}: {
  user: User;
  currentUser: User;
  onRoleChange: (userId: User["_id"], newRole: User["role"]) => void;
}) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(user.role);

  if (user.email === currentUser.email) {
    return (
      <span className="text-gray-400 dark:text-gray-500 text-sm">
        Cannot change your own role
      </span>
    );
  }

  const handleSave = () => {
    if (selectedRole !== user.role) {
      console.log(user._id);
      onRoleChange(user._id, selectedRole);
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        variant="default"
        onClick={() => setOpen(true)}
        className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-[#1e2633] dark:to-[#1b222e] text-gray-800 dark:text-gray-100 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:shadow-md transition-all"
      >
        {user.role}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-[340px] sm:w-[400px] border-l border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-xl"
        >
          <SheetHeader>
            <SheetTitle className="text-xl font-semibold">
              Change Role
            </SheetTitle>
            <SheetDescription className="text-gray-500 dark:text-gray-400">
              Update the role for{" "}
              <span className="font-medium text-gray-800 dark:text-gray-100">
                {user.username}
              </span>
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Role
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

            <Button
              className="w-full mt-4"
              onClick={handleSave}
              disabled={selectedRole === user.role}
            >
              Save Changes
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
