const DropDown = ({ instruccion, datos, datoSeleccionado, setDatoSeleccionado, textColumn }) => {
  return (
    <select
      value={datoSeleccionado}
      onChange={(e) => setDatoSeleccionado(e.target.value)}
      required
      className='rounded-md m-2 p-2 shadow-sm col-span-5 overflow-y-scroll bg-white'
    >
      <option value=''>{instruccion}</option>
      {datos.map((dato) => {
        return (
          <option className='hover:bg-gray-300' key={`dato${dato.id}`} value={dato.id}>
            {dato[textColumn]}
          </option>
        );
      })}
    </select>
  );
};

export default DropDown;
