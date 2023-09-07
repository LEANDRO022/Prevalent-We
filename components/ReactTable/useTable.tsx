import React, { useState, useEffect } from 'react';
import Checkbox2 from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import ReactLoading from 'react-loading';
import dynamic from 'next/dynamic';
const Checkbox: any = dynamic(
  () => {
    return import('@material-ui/core/Checkbox');
  },
  { ssr: false }
);

const EDITAR_USER = gql`
  mutation updateUser($data: UserUpdateInput!, $where: UserWhereUniqueInput!) {
    updateUser(data: $data, where: $where) {
      id
    }
  }
`;

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc' ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'name', label: 'Nombre' },
  { id: 'ducumentId', label: 'Cédula' },
  { id: 'email', label: 'Email' },
  { id: 'empresa', label: 'Empresa' },
  { id: 'rol', label: 'Rol' },
  { id: 'active', label: 'Activo' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false} align='center'>
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>{order === 'desc' ? 'sorted descending' : 'sorted ascending'}</span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function EnhancedTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isActive, setIsActive] = useState(false);
  const { users, roles } = props;

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  function createData(userId, name, documentId, email, empresa, rol, active) {
    return { userId, name, documentId, email, empresa, rol, active };
  }
  const rows = [];
  users.map((e) => {
    rows.push(
      createData(e.id, e.name, e.Perfil ? e.Perfil.document : '', e.email, e.empresa ? e.empresa.name : '', e.roles, e.isActive)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Table className={classes.table} aria-labelledby='tableTitle' size='small' aria-label='enhanced table'>
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <TableRow tabIndex={-1} key={row.name}>
                      <TableCell component='th' id={labelId} scope='row' padding='default'>
                        {row.name}
                      </TableCell>
                      <TableCell align='center'>{row.documentId}</TableCell>
                      <TableCell align='center'>{row.email}</TableCell>
                      <TableCell align='center'>{row.empresa}</TableCell>
                      <TableCell align='center'>
                        <CheckboxTable userId={row.userId} UserRol={row.rol} roles={roles} />
                      </TableCell>
                      <TableCell>
                        <CheckboxActive userActive={row.active} userId={row.userId} />
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const CheckboxActive = (props) => {
  const { userActive, userId } = props;
  const [mutationActive, { loading: mutationActiveLoading, error: mutationActiveError }] = useMutation(EDITAR_USER);
  const [isActive, setIsActive] = useState(userActive);
  const handleChangeActive = (e, id) => {
    setIsActive(e.target.checked);
    //Mutación Active
    const where = {
      id: id,
    };

    let data = {
      isActive: { set: e.target.checked },
    };
    mutationActive({
      variables: { where, data },
    })
      .then(({ data }) => {})
      .catch((e) => {
        console.error(e);
      });
  };

  return (
    <>
      {mutationActiveLoading ? (
        <ReactLoading type={'spinningBubbles'} color={'#26B4FF'} height={30} width={30} />
      ) : (
        <Checkbox checked={isActive} color='primary' onChange={(e) => handleChangeActive(e, userId)} />
      )}
    </>
  );
};

const CheckboxTable = ({ userId, roles, UserRol }) => {
  const [nuevoRol, setNuevoRol] = useState([]);

  useEffect(() => {
    if (roles) {
      const vecRoles = [];
      roles.map((rol) => {
        vecRoles.push({
          id: rol.id,
          name: rol.name,
          condition: UserRol.filter((el) => el.id === rol.id).length > 0,
        });
      });
      setNuevoRol(vecRoles);
    }
  }, [roles]);

  const handleChange = (event, index) => {
    let items = [...nuevoRol];
    let item = {
      ...items[index],
      condition: event.target.checked,
    };
    items[index] = item;
    setNuevoRol(items);
  };

  return (
    <>
      {nuevoRol.length !== 0 && (
        <div className='flex flex-row'>
          {roles.map((rol, index) => {
            return <CheckboxRoles userId={userId} UserRol={UserRol} rol={rol} />;
          })}
        </div>
      )}
    </>
  );
};

const CheckboxRoles = ({ userId, UserRol, rol }) => {
  const [checked, setChecked] = useState(UserRol.filter((rolUser) => rolUser.id === rol.id).length > 0);
  const [mutationRol, { loading: mutationRolLoading, error: mutationRolError }] = useMutation(EDITAR_USER);
  const handleChange = (e) => {
    setChecked(!checked);
    //inicio mutación
    const where = {
      id: userId,
    };
    let data;
    if (e.target.checked) {
      data = {
        roles: {
          connect: {
            id: rol.id,
          },
        },
      };
    } else {
      data = {
        roles: {
          disconnect: {
            id: rol.id,
          },
        },
      };
    }
    mutationRol({
      variables: { where, data },
    })
      .then(({ data }) => {})
      .catch((e) => {
        console.error(e);
      });
    //fin mutación
  };
  return (
    <>
      {mutationRolLoading ? (
        <ReactLoading type={'spinningBubbles'} color={'#26B4FF'} height={30} width={30} />
      ) : (
        <FormControlLabel
          control={
            <Checkbox2
              checked={checked}
              onChange={(e) => handleChange(e)}
              color='primary'
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
          }
          label={rol.name}
          labelPlacement='top'
        />
      )}
    </>
  );
};
