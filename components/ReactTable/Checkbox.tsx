import Checkbox2 from '@material-ui/core/Checkbox';
import React, { useState, useEffect } from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import PropTypes from 'prop-types';

export default function CheckboxTable(props) {
  return (
    <>
      <div>
        <FormControlLabel
          value='start'
          control={<Checkbox2 color='primary' inputProps={{ 'aria-label': 'primary checkbox' }} />}
          label='US'
          labelPlacement='start'
        />
        <FormControlLabel
          value='start'
          control={<Checkbox2 color='primary' inputProps={{ 'aria-label': 'primary checkbox' }} />}
          label='AD'
          labelPlacement='start'
        />
        <FormControlLabel
          value='start'
          control={<Checkbox2 color='primary' inputProps={{ 'aria-label': 'primary checkbox' }} />}
          label='SA'
          labelPlacement='start'
        />
      </div>
    </>
  );
}

CheckboxTable.propTypes = {
  roles: PropTypes.object.isRequired,
};
