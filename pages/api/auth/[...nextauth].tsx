import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import Adapters from 'next-auth/adapters';
import { getLinkedinEmail } from 'utils/api';
import prisma from 'config/prisma';
import nodemailer from 'nodemailer';

interface sendLoginEmailProps {
  identifier: string;
  url: string;
  token: string;
  baseUrl: string;
  provider: { server: string; from: string };
}

const sendLoginEmail = ({
  identifier: email,
  url,
  token,
  baseUrl,
  provider,
}: sendLoginEmailProps) => {
  return new Promise<void>((resolve, reject) => {
    const { server, from } = provider;
    const site = baseUrl.replace(/^https?:\/\//, '');
    nodemailer
      .createTransport({
        host: process.env.EMAIL_SERVER,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
      .sendMail(
        {
          to: email,
          from,
          subject: `Iniciar sesión en Gente DeMente`,
          text: text({ url, site }),
          html: html({ url, site, email }),
        },
        (error) => {
          if (error) {
            console.error('SEND_VERIFICATION_EMAIL_ERROR', email, error);
            return reject(new Error('SEND_VERIFICATION_EMAIL_ERROR' + error));
          }
          return resolve();
        }
      );
  });
};

const html = ({ url, site, email }) => {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, '&#8203;.')}`;
  const escapedSite = `${site.replace(/\./g, '&#8203;.')}`;

  // Some simple styling options
  const backgroundColor = '#f9f9f9';
  const textColor = '#444444';
  const mainBackgroundColor = '#ffffff';
  const buttonBackgroundColor = '#346df1';
  const buttonBorderColor = '#346df1';
  const buttonTextColor = '#ffffff';

  // Uses tables for layout and inline CSS due to email client limitations
  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>Inicia sesión en Gente DeMente</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Iniciar sesión como <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; text-decoration: none;border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Iniciar Sesión</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Si no solicitaste este correo, lo puedes ignorar.
      </td>
    </tr>
  </table>
</body>
`;
};

// Email text body – fallback for email clients that don't render HTML
const text = ({ url, site }) => `Iniciar sesión en ${site}\n${url}\n\n`;

const options = {
  callbacks: {
    /**
     * @param  {object} session      Session object
     * @param  {object} token        User object    (if using database sessions)
     *                               JSON Web Token (if not using database sessions)
     * @return {object}              Session that will be returned to the client
     */
    async signIn(user, account, profile) {
      if (account.provider === 'linkedin' && !user.email) {
        const LinkedinEmail: string = await getLinkedinEmail(account.accessToken).then((res) => {
          return res.elements[0]['handle~'].emailAddress;
        });
        try {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              email: LinkedinEmail,
            },
          });
        } catch (e) {
          console.error('Error', e);
        }
        user.email = LinkedinEmail;
      }
      if (account.provider === 'linkedin' && !user.image) {
        const profilePicture =
          profile.profilePicture?.['displayImage~']?.elements[0]?.identifiers?.[0]?.identifier ??
          '';
        try {
          await prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              image: profilePicture,
            },
          });
        } catch (e) {
          console.error('Error', e);
        }
        user.image = profilePicture;
      }
      if (Object.keys(user).includes('isActive')) {
        return user.isActive;
      } else {
        return true;
      }
    },
    async session(session, token) {
      const session1 = await prisma.session.findUnique({
        where: {
          accessToken: session.accessToken,
        },
      });
      if (session1) {
        let usr;
        usr = await prisma.user.findUnique({
          where: {
            id: session1.userId,
          },
          include: {
            roles: true,
            Perfil: true,
            cv: true,
          },
        });
        if (usr.roles.length === 0) {
          usr = await prisma.user.update({
            where: {
              id: session1.userId,
            },
            data: {
              roles: {
                connect: {
                  id: 'ckkrbqn4y0011ngff2r1qhiw8',
                },
              },
              Perfil: {
                create: {
                  document: '',
                  fechaNacimiento: new Date('2021-01-01'),
                  gender: '',
                  typeDocument: '',
                  image: '',
                },
              },
            },
            include: {
              roles: true,
              Perfil: true,
            },
          });
        }
        session.user = usr;
      }
      return session;
    },
  },
  providers: [
    Providers.LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      scope: 'r_emailaddress r_liteprofile',
      profileUrl:
        'https://api.linkedin.com/v2/me?projection=(id,emailAddress,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))',
      profile: (profileData) => {
        const profileImage =
          profileData?.profilePicture?.['displayImage~']?.elements[0]?.identifiers?.[0]
            ?.identifier ?? '';
        return {
          id: profileData.id,
          name: profileData.localizedFirstName + ' ' + profileData.localizedLastName,
          email: null,
          image: profileImage,
        };
      },
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      authorizationUrl: `https://www.facebook.com/dialog/oauth?response_type=code&prompt=consent`,
    }),
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendLoginEmail,
    }),
    Providers.Auth0({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      authorizationUrl: `https://${process.env.AUTH0_DOMAIN}/authorize?response_type=code&prompt=login`,
    }),
  ],
  session: {
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: 30 * 60, // 30 minutes
  },
  pages: {
    verifyRequest: '/auth/verify-request',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.AUTH_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  adapter: Adapters.Prisma.Adapter({ prisma }),
};

export default (req, res) => NextAuth(req, res, options);
// export default (req, res) =>
//   res.status(200).json({ id: process.env.LINKEDIN_CLIENT_ID, secret: process.env.LINKEDIN_CLIENT_SECRET });
