import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  datePicker: {
    marginRight: '2rem',
  },
}));

const DatePickers4Sales = ({ changeFrom, changeTo, from, to }) => {
  const classes = useStyles();

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yy/MM/dd"
          margin="normal"
          id="sales-from"
          label="From"
          value={from}
          onChange={changeFrom}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          className={classes.datePicker}
        />
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          margin="normal"
          id="sales-to"
          label="To"
          format="yy/MM/dd"
          value={to}
          onChange={changeTo}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default DatePickers4Sales;
