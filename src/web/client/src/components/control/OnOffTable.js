import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import OnOffButton from './OnOffButton';
import Button from '../common/Button';
import palette from '../../lib/styles/palette';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: palette.gray[5],
    color: theme.palette.common.white,
    fontSize: 30,
  },
  body: {
    fontSize: 25,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(even)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 700,
  },
  tableContainer: {
    width: 800,
  },
}));

const textMap = {
  accel: '일방통행',
  elev: 'E/V',
  parking: '차량감지',
  double_parking: '2중주차',
  maxCar: '만차안내',
  parkInOut: '입/출차기',
};

const OnOffTable = ({ form, onChange, onClick }) => {
  const classes = useStyles();

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table className={classes.table} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>이름</StyledTableCell>
            <StyledTableCell align="right">
              <Button red onClick={onClick}>
                초기화
              </Button>
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {form.map((row, idx) => {
            const text = textMap[row.name];

            return (
              <StyledTableRow key={row.name}>
                <StyledTableCell component="th" scope="row">
                  {text}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <OnOffButton row={row} onChange={onChange} idx={idx} />
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OnOffTable;
