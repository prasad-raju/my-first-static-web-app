import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFocusEffect } from "@react-navigation/core";
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Link, Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// Azure Ad
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../../authConfig";
// routes
import { PATH_AUTH } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate()
  const isMountedRef = useIsMountedRef();

  const [showPassword, setShowPassword] = useState(false);

  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    email: 'demo@minimals.cc',
    password: 'demo1234',
    remember: true,
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  useEffect(() => {
    if(isAuthenticated){
     const timer = setTimeout(() => navigate('dashboard/app'), 500);
    }
  },[isAuthenticated]);

  // useFocusEffect(() => {
  //   if(isAuthenticated){
  //     navigate('dashboard/app')
  //   }
  // },[isAuthenticated])

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      const response = await instance.loginPopup(loginRequest);
      console.log(response.accessToken);
      if(response){
        navigate('dashboard/app')
      }
      
      
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  // const onSubmit = async (data) => {
  //   try {
  //     await login(data.email, data.password);
  //     navigate('dashboard/app')
  //   } catch (error) {
  //     console.error(error);
  //     reset();
  //     if (isMountedRef.current) {
  //       setError('afterSubmit', { ...error, message: error.message });
  //     }
  //   }
  // };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="email" label="Email address" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>


      <LoadingButton
        fullWidth size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        style={{ marginTop: '16px', backgroundColor: '#78be20' }}>
        Login
      </LoadingButton>
    </FormProvider>
  );
}
