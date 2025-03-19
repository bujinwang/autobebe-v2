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
import Layout from '../components/Layout';
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
    <Layout>
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
              Add New Staff Member
            </Button>
          </Box>
          
          {/* Filters Section */}
          <Card variant="outlined">
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    placeholder="Search by name or email"
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
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={roleFilter}
                      label="Role"
                      onChange={(e) => setRoleFilter(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <RoleIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="all">All Roles</MenuItem>
                      <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
                      <MenuItem value="CLINIC_ADMIN">Clinic Admin</MenuItem>
                      <MenuItem value="STAFF">Staff</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      label="Status"
                      onChange={(e) => setStatusFilter(e.target.value)}
                      startAdornment={
                        <InputAdornment position="start">
                          <FilterListIcon />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="all">All Status</MenuItem>
                      <MenuItem value="active">Active</MenuItem>
                      <MenuItem value="inactive">Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>

        {/* Staff List Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PersonIcon sx={{ mr: 1 }} />
                    Name
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
                    <RoleIcon sx={{ mr: 1 }} />
                    Role
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PositionIcon sx={{ mr: 1 }} />
                    Position
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SpecialtyIcon sx={{ mr: 1 }} />
                    Specialty
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <StatusIcon sx={{ mr: 1 }} />
                    Status
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <ActionsIcon sx={{ mr: 1 }} />
                    Actions
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaff.map((member) => (
                <TableRow key={member.id} hover>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.position || '-'}</TableCell>
                  <TableCell>{member.specialty || '-'}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color={member.isActive ? 'success' : 'error'}
                      onClick={() => handleToggleStatus(member)}
                      size="small"
                      startIcon={member.isActive ? <ActiveIcon /> : <InactiveIcon />}
                    >
                      {member.isActive ? 'Active' : 'Inactive'}
                    </Button>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/staff/${member.id}`)}
                      size="small"
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Container>
    </Layout>
  );
} 