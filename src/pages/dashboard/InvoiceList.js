import sumBy from 'lodash/sumBy';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Tab,
  Tabs,
  Card,
  Table,
  Stack,
  Switch,
  Button,
  Tooltip,
  Divider,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Grid
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";

// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useTabs from '../../hooks/useTabs';
import useSettings from '../../hooks/useSettings';
import useTable, { getComparator, emptyRows } from '../../hooks/useTable';
// _mock_
import { _invoices } from '../../_mock';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Iconify from '../../components/Iconify';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { TableEmptyRows, TableHeadCustom, TableNoData, TableSelectedActions } from '../../components/table';
// sections
import InvoiceAnalytic from '../../sections/@dashboard/invoice/InvoiceAnalytic';
import { InvoiceTableRow, InvoiceTableToolbar } from '../../sections/@dashboard/invoice/list';

// ----------------------------------------------------------------------

const SERVICE_OPTIONS = [
  'all',
  'full stack development',
  'backend development',
  'ui design',
  'ui/ux design',
  'front end development',
];

const TABLE_HEAD = [
  { id: 'invoiceNumber', label: 'Client', align: 'left' },
  { id: 'createDate', label: 'Create', align: 'left' },
  { id: 'dueDate', label: 'Due', align: 'left' },
  { id: 'price', label: 'Amount', align: 'center', width: 140 },
  { id: 'sent', label: 'Sent', align: 'center', width: 140 },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
];

const useStyles = makeStyles((theme) => ({
  measureNote: {
    width: '30%',
    height: '100%',
    marginLeft: '8px'
  },
  margin: {
    marginBottom: '16px'
  },
  selectBox: {
    width: '100%',
    height: '40px'
  },
  wrapper: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridGap: '20px',
    padding: '16px'
  },
  textBox: {
    width: '100%',
    height: '40px'
  },
  tableContent: {
    padding: '10px',
    display: 'flex',
    flexDirection: "column"
  },
  calenderBox: {
    width: '100% !important',
    marginBottom: '16px',
    display: 'none'
  }
}))
// ----------------------------------------------------------------------

export default function InvoiceList() {
  const theme = useTheme();
  const classes = useStyles()
  const { themeStretch } = useSettings();

  const navigate = useNavigate();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({ defaultOrderBy: 'createDate' });

  const [tableData, setTableData] = useState(_invoices);

  const [filterName, setFilterName] = useState('');

  const [filterService, setFilterService] = useState('all');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const { currentTab: filterStatus, onChangeTab: onFilterStatus } = useTabs('all');

  const handleFilterName = (filterName) => {
    setFilterName(filterName);
    setPage(0);
  };

  const handleFilterService = (event) => {
    setFilterService(event.target.value);
  };

  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.edit(id));
  };

  const handleViewRow = (id) => {
    navigate(PATH_DASHBOARD.invoice.view(id));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterService,
    filterStatus,
    filterStartDate,
    filterEndDate,
  });

  const denseHeight = dense ? 56 : 76;

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterService) ||
    (!dataFiltered.length && !!filterEndDate) ||
    (!dataFiltered.length && !!filterStartDate);

  const getLengthByStatus = (status) => tableData.filter((item) => item.status === status).length;

  const getTotalPriceByStatus = (status) =>
    sumBy(
      tableData.filter((item) => item.status === status),
      'totalPrice'
    );

  const getPercentByStatus = (status) => (getLengthByStatus(status) / tableData.length) * 100;



  const TABS = [
    { value: 'all', label: 'Measure Details', },
    { value: 'paid', label: 'Property Address', },
    { value: 'unpaid', label: 'Queries(0)', },
    { value: 'unpaid', label: 'Query Notice', },
    { value: 'overdue', label: 'Technical Monitoring', },
    { value: 'draft', label: 'Deemed Score Data' },
    { value: 'draft', label: 'Installer Rejection/Credit', },
    { value: 'draft', label: 'Admin Functions', },
  ];

  const [value, setValue] = useState(new Date('2014-08-18T21:11:54'));
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  return (
    <Page title="Edit: Measure">

      <HeaderBreadcrumbs
        heading="Edit Measure"
        links={[
          { name: 'Dashboard', href: PATH_DASHBOARD.root },
          { name: 'Measures', href: PATH_DASHBOARD.invoice.root },
          { name: 'Bulk Measure' },
        ]}
      />

      <Card>
        {/* <TextField
          multiline
          rows={1}
          placeholder="Measure Notes(0)"
          className={classes.measureNote}
          sx={{
            '& fieldset': {
              borderWidth: `1px !important`,
              borderColor: (theme) => `${theme.palette.grey[500_32]} !important`,
            },
          }}
        /> */}
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={filterStatus}
          onChange={onFilterStatus}
          sx={{ px: 2, bgcolor: 'background.neutral' }}
        >
          {TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              value={tab.value}
              label={
                <Stack spacing={1} direction="row" alignItems="center">
                  <div>{tab.label}</div>
                </Stack>
              }
            />
          ))}
        </Tabs>
        <Divider />

        <Scrollbar>
          <div style={{ display: 'flex' }}>

            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              <Table size={dense ? 'small' : 'medium'}>
                <TableBody>

                  <Box className={classes.wrapper}>
                    {/* <Card className={classes.tableContent}>
                    <Grid md={12}>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Measure Status:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Typography style={{ fontWeight: '600' }}>Invoiced</Typography>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Date Received:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Typography>22/02/2022</Typography>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Installer Name:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Typography>Eco Target Ltd</Typography>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Sales Person:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Typography>Paul Inguram</Typography>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin} alignItems="center">
                        <Grid md={4} align="left" sm={6}>
                          <Typography>Submission Type:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Select
                            value={10}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className={classes.selectBox}
                          >
                            <MenuItem value={10}>eTech</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Imported LTS:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Typography>9196</Typography>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin} alignItems="center">
                        <Grid md={4} sm={6}>
                          <Typography>Current LTS:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <OutlinedInput
                            value={"9196"}
                            className={classes.textBox}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>LTS Variance:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Typography>0</Typography>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Installer Value:</Typography>
                        </Grid>
                        <Grid md={6} lg={8} sm={6}>
                          <Typography>1,584.21</Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card> */}
                    {/* ----- */}
                    {/* <Card className={classes.tableContent}>
                    <Grid md={12}>
                      <Grid sx={{ display: 'flex' }} md={12} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Measure Type:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <Select
                            value={10}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className={classes.selectBox}
                          >
                            <MenuItem value={10}>Loft Insulation</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Measure Category:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <Typography>Loft Insulation</Typography>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Month of Measure:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <Select
                            value={10}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className={classes.selectBox}
                          >
                            <MenuItem value={10}>Feb</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Year of Measure:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <Select
                            value={10}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className={classes.selectBox}
                          >
                            <MenuItem value={10}>2019</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Eligibility:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <Select
                            value={10}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className={classes.selectBox}
                          >
                            <MenuItem value={10}>HTH</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Obligation:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <Select
                            value={10}
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                            className={classes.selectBox}
                          >
                            <MenuItem value={10}>HHCRO Insulation</MenuItem>
                          </Select>
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Measure of Ref:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            value={"6823904"}
                            className={classes.textBox}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Associated Ref:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            value={"724564"}
                            className={classes.textBox}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Utility Measure Ref:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            className={classes.textBox}
                            value={""}
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Card> */}
                    {/* ====== */}
                    {/* <Card className={classes.tableContent}>
                    <Grid md={12}>
                      <Grid sx={{ display: 'flex' }} md={12} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Installer Number:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            className={classes.textBox}
                            value={""}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>URN:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            className={classes.textBox}
                            value={""}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Certificate ID:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            className={classes.textBox}
                            value={""}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex', alignItems: "center" }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>Installation Date:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <DesktopDatePicker
                            label=""
                            inputFormat="MM/dd/yyyy"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                            className={classes.calenderBox}
                            style={{ width: '100%' }}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex', alignItems: "center" }} className={classes.margin}>
                        <Grid md={4} lg={4} sm={6}>
                          <Typography>Handover Date:</Typography>
                        </Grid>
                        <Grid md={8} lg={8} sm={6}>
                          <DesktopDatePicker
                            label=""
                            inputFormat="MM/dd/yyyy"
                            value={value}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                            className={classes.calenderBox}
                            style={{ width: '100%' }}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>ECO Hub Reference:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            className={classes.textBox}
                            value={""}
                          />
                        </Grid>
                      </Grid>
                      <Grid md={12} sx={{ display: 'flex' }} className={classes.margin}>
                        <Grid md={4} sm={6}>
                          <Typography>All Compliance Checks Completed:</Typography>
                        </Grid>
                        <Grid md={8} sm={6}>
                          <OutlinedInput
                            className={classes.textBox}
                            value={"6823904"}
                          />
                        </Grid>
                      </Grid>

                    </Grid>
                  </Card> */}
                    <Card className={classes.tableContent}>
                      <TextField
                        id="outlined-basic"
                        label="Measure Status"
                        variant="outlined"
                        defaultValue="Invoiced"
                        className={classes.margin}
                      />

                      <div className={classes.margin}>
                        <DesktopDatePicker
                          label="Date Received"
                          inputFormat="dd/MM/yyyy"
                          value={value}
                          onChange={handleChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                      <TextField
                        id="outlined-basic"
                        label="Installer Name"
                        variant="outlined"
                        defaultValue="Eco Target Ltd"
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Sales Person"
                        variant="outlined"
                        defaultValue="Paul Ingram"
                        className={classes.margin}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Submission Type</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={10}
                          label="Submission Type"
                          onChange={handleChange}
                          className={classes.margin}
                        >
                          <MenuItem value={10} selected>
                            eTech
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        id="outlined-basic"
                        label="Imported LTS"
                        variant="outlined"
                        defaultValue="9196"
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Current LTS"
                        variant="outlined"
                        defaultValue="9196"
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="LTS Variance"
                        variant="outlined"
                        defaultValue="0"
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Installer Value"
                        variant="outlined"
                        defaultValue="1586.31"
                        className={classes.margin}
                      />
                    </Card>

                    <Card className={classes.tableContent}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Measure Type</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={10}
                          label="Measure Type"
                          onChange={handleChange}
                          className={classes.margin}
                        >
                          <MenuItem value={10} selected>
                            Loft Insulation
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        id="outlined-basic"
                        label="Measure Category"
                        variant="outlined"
                        defaultValue="Loft Insulation"
                        className={classes.margin}
                      />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Month of Measure</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={10}
                          label="Month of Measure"
                          onChange={handleChange}
                          className={classes.margin}
                        >
                          <MenuItem value={10} selected>
                            February
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Year of Measure</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={10}
                          label="Submission Type"
                          onChange={handleChange}
                          className={classes.margin}
                        >
                          <MenuItem value={10} selected>
                            2019
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Eligibility</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={10}
                          label="Eligibility"
                          onChange={handleChange}
                          className={classes.margin}
                        >
                          <MenuItem value={10} selected>
                            HTH
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Obligation</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={10}
                          label="Obligation"
                          onChange={handleChange}
                          className={classes.margin}
                        >
                          <MenuItem value={10} selected>
                            HHCRO Insulation
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        id="outlined-basic"
                        label="Measure Ref"
                        variant="outlined"
                        defaultValue="682507"
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Associated Ref"
                        variant="outlined"
                        defaultValue="726029"
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Utility Measure Ref"
                        variant="outlined"
                        defaultValue=""
                        className={classes.margin}
                      />
                    </Card>
                    {/* ------ */}
                    <Card className={classes.tableContent}>
                      <TextField
                        id="outlined-basic"
                        label="Installer Number"
                        variant="outlined"
                        defaultValue=""
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="URN"
                        variant="outlined"
                        defaultValue=""
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="Certificate ID"
                        variant="outlined"
                        defaultValue="Eco Target Ltd"
                        className={classes.margin}
                      />
                      <div className={classes.margin}>
                        <DesktopDatePicker
                          label="Installation Date"
                          inputFormat="dd/MM/yyyy"
                          value={value}
                          onChange={handleChange}
                          renderInput={(params) => <TextField {...params} />}
                          className={classes.calenderBox}
                          fullWidth

                        />
                      </div>
                      <div className={classes.margin}>
                        <DesktopDatePicker
                          label="Handover Date"
                          inputFormat="dd/MM/yyyy"
                          value={value}
                          onChange={handleChange}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </div>
                      <TextField
                        id="outlined-basic"
                        label="ECO Hub Reference"
                        variant="outlined"
                        defaultValue=""
                        className={classes.margin}
                      />
                      <TextField
                        id="outlined-basic"
                        label="All Compliance Checks Completed"
                        variant="outlined"
                        defaultValue=""
                        className={classes.margin}
                      />

                    </Card>

                  </Box>


                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Scrollbar>
      </Card>

    </Page >
  );
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterService,
  filterStartDate,
  filterEndDate,
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter(
      (item) =>
        item.invoiceNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        item.invoiceTo.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item) => item.status === filterStatus);
  }

  if (filterService !== 'all') {
    tableData = tableData.filter((item) => item.items.some((c) => c.service === filterService));
  }

  if (filterStartDate && filterEndDate) {
    tableData = tableData.filter(
      (item) =>
        item.createDate.getTime() >= filterStartDate.getTime() && item.createDate.getTime() <= filterEndDate.getTime()
    );
  }

  return tableData;
}
