const prepend = require('prepend');
const fs = require('fs');

const main = () => {
  const data = fs.readFileSync('./prisma/schema.prisma', 'utf-8').toString();

  const newData = data
    .replace(
      'datasource db {\n	provider = "postgresql"\n	url = env("DATABASE_URL")\n}',
      ''
    )
    .replace('generator client {\n	provider = "prisma-client-js"\n}', '');

  fs.writeFileSync('./prisma/schema.prisma', newData, 'utf-8');

  prepend(
    './prisma/schema.prisma',

    (error: { message: any }) => {
      // eslint-disable-next-line no-console
      if (error) console.error(error.message);
      prepend(
        './prisma/schema.prisma',
        'generator client {\n  provider = "prisma-client-js"\n }\n',
        (error2: any) => {
          // eslint-disable-next-line no-console
          if (error2) console.error(error.message);
          prepend(
            './prisma/schema.prisma',
            'datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n }\n',
            (error3: any) => {
              // eslint-disable-next-line no-console
              if (error3) console.error(error.message);
            }
          );
        }
      );
    }
  );
};

main();

export default main;
