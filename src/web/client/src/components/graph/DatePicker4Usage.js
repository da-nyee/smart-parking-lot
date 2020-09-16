import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

const DatePicker4Usage = ({ changeDate, date }) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container>
        <KeyboardDatePicker
          disableToolbar
          variant="inline"
          format="yy/MM/dd"
          margin="normal"
          id="usage-date"
          label="Date"
          value={date}
          onChange={changeDate}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker4Usage;
