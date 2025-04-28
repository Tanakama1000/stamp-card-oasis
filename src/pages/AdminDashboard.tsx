import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/sonner";
import { Switch } from "@/components/ui/switch";
import Layout from "@/components/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Toggle } from "@/components/ui/toggle";

type Business = {
  id: string;
  name: string;
  is_active: boolean;
  slug: string;
  created_at: string;
  updated_at: string;
  avatar_url?: string;
};

const ITEMS_PER_PAGE = 10;

const AdminDashboard: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusinesses, setSelectedBusinesses] = useState<string[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    new: 0, // Businesses created in the last 7 days
  });

  // Calculate pagination values
  const totalPages = Math.ceil(filteredBusinesses.length / ITEMS_PER_PAGE);
  const paginatedBusinesses = filteredBusinesses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    fetchBusinesses();
  }, []);

  useEffect(() => {
    // Apply filters when search or filter state changes
    applyFilters();
  }, [search, filter, businesses]);

  const fetchBusinesses = async () => {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('id, name, is_active, slug, created_at, updated_at')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setBusinesses(data || []);
      calculateStats(data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      toast.error('Failed to load businesses');
      setLoading(false);
    }
  };

  const calculateStats = (businessesData: Business[]) => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const stats = {
      total: businessesData.length,
      active: businessesData.filter(b => b.is_active).length,
      inactive: businessesData.filter(b => !b.is_active).length,
      new: businessesData.filter(b => new Date(b.created_at) >= sevenDaysAgo).length,
    };
    
    setStats(stats);
  };

  const applyFilters = () => {
    let result = [...businesses];
    
    // Apply search filter
    if (search) {
      result = result.filter(business => 
        business.name.toLowerCase().includes(search.toLowerCase()) || 
        business.slug.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filter === 'active') {
      result = result.filter(business => business.is_active);
    } else if (filter === 'inactive') {
      result = result.filter(business => !business.is_active);
    }
    
    setFilteredBusinesses(result);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const toggleBusinessStatus = async (businessId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', businessId);

      if (error) throw error;

      // Update local state to reflect the change
      setBusinesses(businesses.map(business => 
        business.id === businessId 
          ? { ...business, is_active: !currentStatus, updated_at: new Date().toISOString() } 
          : business
      ));

      toast.success(`Business ${!currentStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating business status:', error);
      toast.error('Failed to update business status');
    }
  };

  const deleteBusiness = async (businessId: string) => {
    try {
      const { error } = await supabase
        .rpc('delete_business_cascade', {
          business_id_param: businessId
        });

      if (error) throw error;

      // Update local state to remove the business
      setBusinesses(businesses.filter(business => business.id !== businessId));
      toast.success("Business and all associated data deleted successfully");
    } catch (error) {
      console.error('Error deleting business:', error);
      toast.error('Failed to delete business and its data');
    }
  };

  const handleBulkToggle = async (makeActive: boolean) => {
    if (selectedBusinesses.length === 0) {
      toast.error("No businesses selected");
      return;
    }

    try {
      const { error } = await supabase
        .from('businesses')
        .update({ 
          is_active: makeActive,
          updated_at: new Date().toISOString()
        })
        .in('id', selectedBusinesses);

      if (error) throw error;

      // Update local state
      setBusinesses(businesses.map(business => 
        selectedBusinesses.includes(business.id)
          ? { ...business, is_active: makeActive, updated_at: new Date().toISOString() }
          : business
      ));

      toast.success(`${selectedBusinesses.length} businesses ${makeActive ? 'activated' : 'deactivated'}`);
      setSelectedBusinesses([]); // Clear selection after operation
    } catch (error) {
      console.error('Error updating businesses:', error);
      toast.error('Failed to update businesses');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBusinesses.length === 0) {
      toast.error("No businesses selected");
      return;
    }

    try {
      // Delete each selected business using the cascade function
      for (const businessId of selectedBusinesses) {
        const { error } = await supabase
          .rpc('delete_business_cascade', {
            business_id_param: businessId
          });
          
        if (error) throw error;
      }

      // Update local state
      setBusinesses(businesses.filter(business => !selectedBusinesses.includes(business.id)));
      toast.success(`${selectedBusinesses.length} businesses and their data deleted`);
      setSelectedBusinesses([]); // Clear selection after operation
    } catch (error) {
      console.error('Error deleting businesses:', error);
      toast.error('Failed to delete businesses and their data');
    }
  };

  const toggleSelectBusiness = (businessId: string) => {
    if (selectedBusinesses.includes(businessId)) {
      setSelectedBusinesses(selectedBusinesses.filter(id => id !== businessId));
    } else {
      setSelectedBusinesses([...selectedBusinesses, businessId]);
    }
  };

  const selectAllBusinesses = () => {
    if (selectedBusinesses.length === paginatedBusinesses.length) {
      setSelectedBusinesses([]);
    } else {
      setSelectedBusinesses(paginatedBusinesses.map(business => business.id));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <div>Loading businesses...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Inactive Businesses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New (Last 7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Business Management</h1>
          
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            {/* Search Bar */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search businesses..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Filter Options */}
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-36">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Businesses</SelectItem>
                <SelectItem value="active">Active Only</SelectItem>
                <SelectItem value="inactive">Inactive Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedBusinesses.length > 0 && (
          <div className="bg-gray-100 p-3 rounded-md mb-4 flex items-center justify-between">
            <span className="text-sm font-medium">{selectedBusinesses.length} businesses selected</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkToggle(true)}>
                Activate All
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkToggle(false)}>
                Deactivate All
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will delete {selectedBusinesses.length} businesses and cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleBulkDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedBusinesses.length === paginatedBusinesses.length && paginatedBusinesses.length > 0}
                      onChange={selectAllBusinesses}
                      className="rounded border-gray-300"
                    />
                  </div>
                </TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBusinesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedBusinesses.includes(business.id)}
                      onChange={() => toggleSelectBusiness(business.id)}
                      className="rounded border-gray-300"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={business.avatar_url} alt={business.name} />
                        <AvatarFallback>{business.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span>{business.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{business.slug}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      business.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {business.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(business.updated_at)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {/* Confirm Toggle */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Toggle 
                            pressed={business.is_active} 
                            className={`${business.is_active ? 'bg-green-100' : 'bg-gray-100'}`}
                          >
                            {business.is_active ? 'Active' : 'Inactive'}
                          </Toggle>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirm Status Change</AlertDialogTitle>
                            <AlertDialogDescription>
                              {business.is_active 
                                ? "This business will be deactivated and customers won't be able to join the loyalty program."
                                : "This business will be activated and customers can join the loyalty program."}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => toggleBusinessStatus(business.id, business.is_active)}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      
                      {/* Delete Business */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-800 hover:bg-red-100">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will delete the business "{business.name}" and all associated data. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteBusiness(business.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredBusinesses.length === 0 && (
          <div className="text-center text-gray-500 my-8">
            No businesses found
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                
                // Display first page, last page, and pages around current page
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink 
                        isActive={pageNumber === currentPage} 
                        onClick={() => setCurrentPage(pageNumber)}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                } else if (
                  (pageNumber === 2 && currentPage > 3) || 
                  (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return <PaginationEllipsis key={pageNumber} />;
                }
                
                return null;
              })}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>
    </Layout>
  );
};

export default AdminDashboard;
