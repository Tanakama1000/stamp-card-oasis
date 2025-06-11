
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { User, LogOut, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProfileDropdownProps {
  customerName: string;
  onNameUpdate: (newName: string) => void;
  themeColor: string;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  customerName,
  onNameUpdate,
  themeColor
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(customerName);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      // Redirect to home or login page
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveName = () => {
    onNameUpdate(tempName);
    setIsEditing(false);
    toast({
      title: "Name updated",
      description: "Your card name has been updated successfully.",
    });
  };

  const handleCancelEdit = () => {
    setTempName(customerName);
    setIsEditing(false);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          style={{ borderColor: themeColor, color: themeColor }}
        >
          <User size={20} />
          Profile
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4">
        <div className="space-y-3">
          <div className="font-medium text-sm" style={{ color: themeColor }}>
            Profile Settings
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Card Name</label>
            {isEditing ? (
              <div className="space-y-2">
                <Input
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-sm"
                />
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    onClick={handleSaveName}
                    className="flex-1 text-xs"
                    style={{ backgroundColor: themeColor }}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelEdit}
                    className="flex-1 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {customerName || "No name set"}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-6 px-2"
                >
                  <Edit size={12} />
                </Button>
              </div>
            )}
          </div>
          
          <DropdownMenuItem 
            onClick={handleLogout}
            className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            Log Out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
