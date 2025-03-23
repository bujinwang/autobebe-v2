import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Container,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  Grid,
  InputAdornment,
  Card,
  CardContent,
} from '@mui/material';
import { staffService, type StaffMember } from '../services';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import {
  Add as AddIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Edit as EditIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Badge as RoleIcon,
  Work as PositionIcon,
  LocalHospital as SpecialtyIcon,
  Email as EmailIcon,
  ToggleOn as StatusIcon,
  Settings as ActionsIcon,
  Person as PersonIcon
} from '@mui/icons-material';

export default function StaffList() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadStaffMembers();
  }, [user?.defaultClinicId]);

  const loadStaffMembers = async () => {
    try {
      if (!user?.defaultClinicId) return;
      const data = await staffService.getStaffMembers(user.defaultClinicId.toString());
      setStaff(data);
    } catch (error) {
      toast.error('Failed to load staff members');
      console.error('Error loading staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staffMember: StaffMember) => {
    try {
      await staffService.toggleStaffStatus(staffMember.id, !staffMember.isActive);
      await loadStaffMembers();
      toast.success(`Staff member ${staffMember.isActive ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update staff status');
      console.error('Error updating staff status:', error);
    }
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && member.isActive) ||
                         (statusFilter === 'inactive' && !member.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <Container maxWidth="xl">
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Staff Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => navigate('/staff/new')}
          >
            Add Staff Member
          </Button>
        </Box>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your clinic staff, doctors, and other personnel
        </Typography>
      </Box>

      {/* Search and Filter Section */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            placeholder="Search by name or email"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="role-filter-label">Filter by Role</InputLabel>
            <Select
              labelId="role-filter-label"
              id="role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              label="Filter by Role"
            >
              <MenuItem value="all">All Roles</MenuItem>
              <MenuItem value="DOCTOR">Doctors</MenuItem>
              <MenuItem value="NURSE">Nurses</MenuItem>
              <MenuItem value="RECEPTIONIST">Receptionists</MenuItem>
              <MenuItem value="CLINIC_ADMIN">Clinic Admins</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="status-filter-label">Filter by Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label="Filter by Status"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Staff Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PersonIcon sx={{ mr: 1 }} />
                  Staff Member
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RoleIcon sx={{ mr: 1 }} />
                  Role
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 1 }} />
                  Email
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <StatusIcon sx={{ mr: 1 }} />
                  Status
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                  <ActionsIcon sx={{ mr: 1 }} />
                  Actions
                </Box>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            ) : filteredStaff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No staff members found</TableCell>
              </TableRow>
            ) : (
              filteredStaff.map((staff) => (
                <TableRow key={staff.id} hover>
                  <TableCell>{staff.name}</TableCell>
                  <TableCell>{staff.role}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>
                    {staff.isActive ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'success.main' }}>
                        <ActiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Active
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.main' }}>
                        <InactiveIcon fontSize="small" sx={{ mr: 0.5 }} />
                        Inactive
                      </Box>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color={staff.isActive ? "error" : "success"}
                        onClick={() => handleToggleStatus(staff)}
                      >
                        {staff.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<EditIcon />}
                        onClick={() => navigate(`/staff/${staff.id}`)}
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
} 