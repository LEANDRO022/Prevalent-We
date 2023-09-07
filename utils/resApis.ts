export default function renameResApi(
  response: { codigo: string; nombre: any; razonSocial: any }[]
) {
  const options = response
    ?.map((item: { codigo: string; nombre: any; razonSocial: any }) => {
      if (item.codigo !== '' && item.codigo) {
        return {
          id: item.codigo,
          name: item.nombre || item.razonSocial,
        };
      }
      return null;
    })
    .filter(Boolean);

  return options;
}
