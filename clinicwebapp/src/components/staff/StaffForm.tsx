import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Button,
  Box,
  Typography,
  FormHelperText,
} from '@mui/material';
import { StaffMember } from '../../services/staffService';

const staffFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.enum(['SUPER_ADMIN', 'CLINIC_ADMIN', 'STAFF']),
  position: z.string().optional(),
  specialty: z.string().optional(),
  isActive: z.boolean(),
  clinicId: z.string(),
});

type StaffFormData = z.infer<typeof staffFormSchema>;

interface StaffFormProps {
  initialData?: Partial<StaffMember>;
  onSubmit: (data: StaffFormData) => void;
  isLoading?: boolean;
  clinicId: string;
}

export function StaffForm({ initialData, onSubmit, isLoading, clinicId }: StaffFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StaffFormData>({
    resolver: zodResolver(staffFormSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: initialData?.email || '',
      role: initialData?.role || 'STAFF',
      position: initialData?.position || '',
      specialty: initialData?.specialty || '',
      isActive: initialData?.isActive ?? true,
      clinicId: clinicId,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Box display="grid" gap={3}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Name"
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
            />
          )}
        />

        {!initialData && (
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                type="password"
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
              />
            )}
          />
        )}

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.role} fullWidth>
              <InputLabel>Role</InputLabel>
              <Select {...field} label="Role">
                <MenuItem value="STAFF">Staff</MenuItem>
                <MenuItem value="CLINIC_ADMIN">Clinic Admin</MenuItem>
                <MenuItem value="SUPER_ADMIN">Super Admin</MenuItem>
              </Select>
              {errors.role && (
                <FormHelperText>{errors.role.message}</FormHelperText>
              )}
            </FormControl>
          )}
        />

        <Controller
          name="position"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Position"
              error={!!errors.position}
              helperText={errors.position?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="specialty"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Specialty"
              error={!!errors.specialty}
              helperText={errors.specialty?.message}
              fullWidth
            />
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field: { value, onChange } }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={value}
                  onChange={(e) => onChange(e.target.checked)}
                />
              }
              label={
                <Box>
                  <Typography variant="body1">Active Status</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Determine if this staff member is currently active
                  </Typography>
                </Box>
              }
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          fullWidth
        >
          {isLoading
            ? 'Saving...'
            : initialData
            ? 'Update Staff Member'
            : 'Add Staff Member'}
        </Button>
      </Box>
    </form>
  );
} 