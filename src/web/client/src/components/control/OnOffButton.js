import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    width: '10rem',
  },
  radioLabel: {
    fontSize: 25,
  },
}));

const OnOffButton = ({ row, idx, onChange }) => {
  const classes = useStyles();

  const GreenRadio = withStyles({
    root: {
      '&$checked': {
        color: green[600],
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />);

  return (
    <FormControl component="fieldset">
      <RadioGroup
        row
        aria-label="status"
        name={row.name}
        className={classes.radioGroup}
        onChange={(e) => onChange(idx, e)}
      >
        <FormControlLabel
          value={1}
          control={<GreenRadio color="primary" checked={row.status} />}
          label={<span style={{ fontSize: '1.5rem' }}>On</span>}
          labelPlacement="start"
        />
        <FormControlLabel
          value={0}
          control={<GreenRadio color="primary" checked={!row.status} />}
          label={<span style={{ fontSize: '1.5rem' }}>Off</span>}
          labelPlacement="start"
        />
      </RadioGroup>
    </FormControl>
  );
};

export default OnOffButton;
