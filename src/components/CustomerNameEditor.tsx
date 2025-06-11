
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit2, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface CustomerNameEditorProps {
  currentName: string;
  businessId: string;
  memberId: string | null;
  userId: string | null;
  onNameUpdate: (newName: string) => void;
}

const CustomerNameEditor: React.FC<CustomerNameEditorProps> = ({
  currentName,
  businessId,
  memberId,
  userId,
  onNameUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(currentName);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!businessId || !memberId) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('business_members')
        .update({ customer_name: newName.trim() })
        .eq('id', memberId);

      if (error) throw error;

      // Update localStorage for anonymous users
      if (!userId) {
        try {
          const savedMemberships = localStorage.getItem('memberships') || '[]';
          const memberships = JSON.parse(savedMemberships);
          const membershipIndex = memberships.findIndex((m: any) => m.id === memberId);
          
          if (membershipIndex !== -1) {
            memberships[membershipIndex].customerName = newName.trim();
            localStorage.setItem('memberships', JSON.stringify(memberships));
          }
        } catch (e) {
          console.error("Error updating localStorage:", e);
        }
      }

      onNameUpdate(newName.trim());
      setIsEditing(false);
      
      toast({
        title: "Name Updated",
        description: "Your name has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating name:', error);
      toast({
        title: "Error",
        description: "Failed to update your name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewName(currentName);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <Label className="text-sm text-gray-600">Your Name</Label>
          <p className="font-medium">{currentName || 'No name set'}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="flex items-center gap-1"
        >
          <Edit2 size={14} />
          Edit
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <Label htmlFor="edit-name" className="text-sm text-gray-600">
        Edit Your Name
      </Label>
      <div className="flex items-center gap-2 mt-1">
        <Input
          id="edit-name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter your name"
          className="flex-1"
          disabled={isLoading}
        />
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          disabled={isLoading || newName.trim() === currentName}
          className="flex items-center gap-1"
        >
          <Check size={14} />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isLoading}
          className="flex items-center gap-1"
        >
          <X size={14} />
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default CustomerNameEditor;
