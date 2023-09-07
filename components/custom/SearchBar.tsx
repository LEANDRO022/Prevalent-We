import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function ComboBox(datos) {
  const top100Films = [datos];

  return (
    <Autocomplete
      id='combo-box-demo'
      options={top100Films}
      getOptionLabel={(option) => option.id}
      style={{ width: 300 }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
}
