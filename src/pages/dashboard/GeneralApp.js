// @mui
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';
import merge from 'lodash/merge';
import { LoadingButton } from '@mui/lab';
// Azure Ad
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../authConfig";
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
import { BaseOptionChart } from '../../components/chart';
import { EcommerceSalesOverview } from '../../sections/@dashboard/general/e-commerce'
import { AnalyticsWebsiteVisits } from '../../sections/@dashboard/general/analytics'
// components
import Page from '../../components/Page';
// sections
import {
  AppWidget,
  AppWelcome,
  AppFeatured,
  AppNewInvoice,
  AppTopAuthors,
  AppTopRelated,
  AppAreaInstalled,
  AppWidgetSummary,
  AppCurrentDownload,
  AppTopInstalledCountries,
} from '../../sections/@dashboard/general/app';


function ColumnChart() {
  const CHART_DATA = [
    {
      year: 'Week',
      data: [
        { name: 'Income', data: [10, 41, 35, 151, 49, 62, 69, 91, 48] },
        { name: 'Expenses', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
      ],
    },
    {
      year: 'Month',
      data: [
        { name: 'Income', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
        { name: 'Expenses', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
      ],
    },
    {
      year: 'Year',
      data: [
        { name: 'Income', data: [76, 42, 29, 41, 27, 138, 117, 86, 63] },
        { name: 'Expenses', data: [80, 55, 34, 114, 80, 130, 15, 28, 55] },
      ],
    },
  ];
  const chartOptions = merge(BaseOptionChart(), {
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    tooltip: {
      y: {
        formatter: (val: number) => `$${val}`,
      },
    },
  });
  const [seriesData, setSeriesData] = useState('Year');
  const { instance, accounts } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleLogout = (logoutType) => {
      instance.logoutPopup({
          postLogoutRedirectUri: "/",
          mainWindowRedirectUri: "/"
      });
  }
  return (
    <>
      <div>
      <LoadingButton onClick={() => handleLogout()} style={{ marginTop: '16px', backgroundColor: '#78beaa', color: '#ffffff' }}>
        Sign-Out
      </LoadingButton>
      </div>
      {CHART_DATA.map((item: any) => (
        <Box key={item.year} dir="ltr" style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}>
          {item.year === seriesData && (
            <ReactApexChart type="bar" series={item.data} options={chartOptions} height={364} />
          )}
        </Box>
      ))}
    </>
  )
}
// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth();
  const theme = useTheme();
  const { themeStretch } = useSettings();

  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <AppWelcome />
          </Grid>

          <Grid item xs={12} md={6}>
            <ColumnChart />
          </Grid>

          <Grid item xs={12} md={6}>
            <AnalyticsWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6}>
            <EcommerceSalesOverview />
          </Grid>



          {/* <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Active Users"
              percent={2.6}
              total={18765}
              chartColor={theme.palette.primary.main}
              chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Installed"
              percent={0.2}
              total={4876}
              chartColor={theme.palette.chart.blue[0]}
              chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <AppWidgetSummary
              title="Total Downloads"
              percent={-0.1}
              total={678}
              chartColor={theme.palette.chart.red[0]}
              chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled />
          </Grid>

          <Grid item xs={12} lg={8}>
            <AppNewInvoice />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget title="Applications" total={55566} icon={'eva:email-fill'} color="warning" chartData={75} />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  );
}
