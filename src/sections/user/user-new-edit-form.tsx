import type { AppDispatch } from 'src/store';

import { z as zod } from 'zod';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { register } from 'src/store/slices/auth0Store';

import { toast } from 'src/components/snackbar';
import { Form, Field } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export type NewUserSchemaType = zod.infer<typeof NewUserSchema>;

export const NewUserSchema = zod.object({
  given_name: zod.string().min(1, 'El nombre es obligatorio'),
  family_name: zod.string().min(1, 'El apellido es obligatorio'),
  email: zod.string().email('Correo electrónico no válido'),
  password: zod
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .regex(/[a-z]/, 'La contraseña debe contener al menos una letra minúscula')
    .regex(/[A-Z]/, 'La contraseña debe contener al menos una letra mayúscula')
    .regex(/[0-9]/, 'La contraseña debe contener al menos un número')
    .regex(/[^a-zA-Z0-9]/, 'La contraseña debe contener al menos un carácter especial'),
});

// ----------------------------------------------------------------------

type Props = {
  currentUser?: {
    given_name: string;
    email: string;
    role: string;
    family_name: string;
  };
};

export function UserNewEditForm({ currentUser }: Props) {
  const defaultValues = useMemo(
    () => ({
      given_name: currentUser?.given_name || '',
      family_name: currentUser?.family_name || '',
      email: currentUser?.email || '',
      password: '',
    }),
    [currentUser]
  );

  const methods = useForm<NewUserSchemaType>({
    mode: 'onSubmit',
    resolver: zodResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const dispatch = useDispatch<AppDispatch>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await dispatch(register(data));
      toast.success('Usuario creado');
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Typography variant="h4" sx={{ mb: 3 }}>
          {currentUser ? 'Edit user' : 'Nuevo usuario'}
        </Typography>

        <Grid md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
            >
              <Field.Text name="given_name" label="Nombre" />
              <Field.Text name="family_name" label="Apellido" />
              <Field.Text name="email" label="Correo" />
              <Field.Text name="password" label="Password" />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Crear Usuario' : 'Save changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </Form>
  );
}
