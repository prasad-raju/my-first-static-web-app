import {useEffect} from 'react';
import { capitalCase } from 'change-case';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Stack, Link, Alert, Tooltip, Container, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { LoadingButton } from '@mui/lab';
// Azure Ad
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
// routes
import { PATH_AUTH } from '../../routes/paths';
// hooks
import useAuth from '../../hooks/useAuth';
import useResponsive from '../../hooks/useResponsive';
// components
import Page from '../../components/Page';
import Logo from '../../components/Logo';
import Image from '../../components/Image';
// sections
import { LoginForm } from '../../sections/auth/login';


// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  alignItems: 'center',
  border: '1px solid gray',
  margin: '16px',

  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const HeaderStyle = styled('header')(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  position: 'absolute',
  padding: theme.spacing(3),
  justifyContent: 'space-between',
  [theme.breakpoints.up('md')]: {
    alignItems: 'flex-start',
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '85vh',
  flexDirection: 'column',
  justifyContent: 'center'
}));

const useStyles = makeStyles((theme) => ({
  textCenter: {
    textAlign: 'center'
  },
  versionText: {
    textAlign: 'center',
    fontSize: '14px',
    color: 'gray',
    paddingTop: '16px'
  },
  logo: {
    width: '15%',
    height: '50%',
    margin: '16px'
  },

  loginForm: {
    width: '80%',
    margin: '0 auto'
  }

}));

// ----------------------------------------------------------------------

export default function Login() {
  const { method } = useAuth();
  const classes = useStyles()
  const smUp = useResponsive('up', 'sm');

  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();

  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogin = () => {
    instance.loginPopup(loginRequest).then((response) => {if(response){navigate('dashboard/app')}}).catch(e => {
        console.log(e);
    });
    console.log(accounts);
    // if(accounts){
    //   navigate('dashboard/app');
    // }
  }

  const handleLogout = (logoutType) => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
  }

  return (
    <Page title="Login">
      <img src="/logo/splash_Logo.png" className={classes.logo} alt="" />
      <RootStyle>
        <Grid lg={12} md={12} container >
          <Grid lg={6} md={6} xs={12} sm={12}>
            <img src="/logo/eco-logo.jpg" style={{ width: '100%' }} alt="" />
          </Grid>
          <Grid lg={6} md={6} xs={12} sm={12}>
            <Container >
              <ContentStyle>
                <Stack direction="row" alignItems="center" sx={{ mb: 5 }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" gutterBottom className={classes.textCenter}>
                      Welcome to ECO Control App
                    </Typography>
                    <Typography sx={{ color: 'text.secondary' }} className={classes.textCenter}>
                      <UnauthenticatedTemplate>
                        {/* <LoadingButton onClick={() => handleLogin()} style={{ marginTop: '16px', backgroundColor: '#78be20', color: '#ffffff' }}>
                          Sign-In with your credentials
                        </LoadingButton> */}
                      </UnauthenticatedTemplate>
                      <AuthenticatedTemplate>
                        <LoadingButton onClick={() => handleLogout()} style={{ marginTop: '16px', backgroundColor: '#78beaa', color: '#ffffff' }}>
                          Sign-Out
                        </LoadingButton>
                      </AuthenticatedTemplate>
                    </Typography>
                  </Box>
                </Stack>
                <div className={classes.loginForm}>
                  <LoginForm />
                  <Typography className={classes.versionText}>Version No. 1.2.3 </Typography>
                </div>
              </ContentStyle>
            </Container>
          </Grid>
        </Grid>
      </RootStyle>
    </Page>
  );
}
