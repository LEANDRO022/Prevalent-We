import nodemailer from 'nodemailer';

const SendMail = (req: any, res: any) => {
  if (req.method === 'POST') {
    const { email, name, password } = req.body;
    const transporter: any = nodemailer.createTransport({
      host: 'email-smtp.us-east-1.amazonaws.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const message = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Mi primer acceso | Contraseña predeterminado',
      // Aquí debes agregar el email Temple(Codigo Html)
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="font-family:arial, 'helvetica neue', helvetica, sans-serif">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <title>Bienvenid@ a Green loop</title><!--[if (mso 16)]>
    <style type="text/css">
    a {text-decoration: none;}
    </style>
    <![endif]--><!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--><!--[if gte mso 9]>
<xml>
    <o:OfficeDocumentSettings>
    <o:AllowPNG></o:AllowPNG>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
</xml>
<![endif]-->
  <style type="text/css">
#outlook a {
	padding:0;
}
.es-button {
	mso-style-priority:100!important;
	text-decoration:none!important;
}
a[x-apple-data-detectors] {
	color:inherit!important;
	text-decoration:none!important;
	font-size:inherit!important;
	font-family:inherit!important;
	font-weight:inherit!important;
	line-height:inherit!important;
}
.es-desk-hidden {
	display:none;
	float:left;
	overflow:hidden;
	width:0;
	max-height:0;
	line-height:0;
	mso-hide:all;
}
.es-button-border:hover a.es-button, .es-button-border:hover button.es-button {
	background:#88dd88!important;
	color:#000000!important;
}
.es-button-border:hover {
	border-color:#42d159 #42d159 #42d159 #42d159!important;
	background:#88dd88!important;
}
td .es-button-border:hover a.es-button-1 {
	color:#eef1f4!important;
	background:#9ACA28!important;
}
td .es-button-border-2:hover {
	background:#9ACA28!important;
}
@media only screen and (max-width:600px) {p, ul li, ol li { margin-bottom:9px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li { margin-bottom:8px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li { margin-bottom:9px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li { margin-bottom:8px!important } p, ul li, ol li, a { line-height:120%!important } h1, h2, h3, h1 a, h2 a, h3 a { line-height:120%!important } h1 { font-size:28px!important; text-align:left; margin-bottom:17px } h2 { font-size:24px!important; text-align:left; margin-bottom:15px } h3 { font-size:20px!important; text-align:left; margin-bottom:12px } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:28px!important; text-align:left } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:24px!important; text-align:left } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important; text-align:left } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:12px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:13px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:inline-block!important } a.es-button, button.es-button { font-size:20px!important; display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0!important } .es-m-p0r { padding-right:0!important } .es-m-p0l { padding-left:0!important } .es-m-p0t { padding-top:0!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } .es-m-p5 { padding:5px!important } .es-m-p5t { padding-top:5px!important } .es-m-p5b { padding-bottom:5px!important } .es-m-p5r { padding-right:5px!important } .es-m-p5l { padding-left:5px!important } .es-m-p10 { padding:10px!important } .es-m-p10t { padding-top:10px!important } .es-m-p10b { padding-bottom:10px!important } .es-m-p10r { padding-right:10px!important } .es-m-p10l { padding-left:10px!important } .es-m-p15 { padding:15px!important } .es-m-p15t { padding-top:15px!important } .es-m-p15b { padding-bottom:15px!important } .es-m-p15r { padding-right:15px!important } .es-m-p15l { padding-left:15px!important } .es-m-p20 { padding:20px!important } .es-m-p20t { padding-top:20px!important } .es-m-p20r { padding-right:20px!important } .es-m-p20l { padding-left:20px!important } .es-m-p25 { padding:25px!important } .es-m-p25t { padding-top:25px!important } .es-m-p25b { padding-bottom:25px!important } .es-m-p25r { padding-right:25px!important } .es-m-p25l { padding-left:25px!important } .es-m-p30 { padding:30px!important } .es-m-p30t { padding-top:30px!important } .es-m-p30b { padding-bottom:30px!important } .es-m-p30r { padding-right:30px!important } .es-m-p30l { padding-left:30px!important } .es-m-p35 { padding:35px!important } .es-m-p35t { padding-top:35px!important } .es-m-p35b { padding-bottom:35px!important } .es-m-p35r { padding-right:35px!important } .es-m-p35l { padding-left:35px!important } .es-m-p40 { padding:40px!important } .es-m-p40t { padding-top:40px!important } .es-m-p40b { padding-bottom:40px!important } .es-m-p40r { padding-right:40px!important } .es-m-p40l { padding-left:40px!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; max-height:inherit!important } .h-auto { height:auto!important } }
</style>
 </head>
 <body style="width:100%;font-family:arial, 'helvetica neue', helvetica, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div class="es-wrapper-color" style="background-color:#EEF1F4"><!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#EEF1F4"></v:fill>
			</v:background>
		<![endif]-->
   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:left top;background-color:#EEF1F4">
     <tr>
      <td valign="top" style="padding:0;Margin:0">
       <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr>
          <td class="es-info-area" align="center" style="padding:0;Margin:0">
           <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF">
             <tr>
              <td align="left" bgcolor="#fafafa" style="padding:20px;Margin:0;background-color:#fafafa;border-radius:10px 10px 0px 0px">
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:0px;font-size:0px;color:#CCCCCC;margin-bottom:8px"><img src="https://greenloop-plataformagestion.s3.amazonaws.com/galeria/LogitipoOficial.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="156" height="156"></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
             <tr>
              <td align="left" bgcolor="#fafafa" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;padding-top:40px;background-color:#fafafa">
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-left:10px solid transparent;border-right:10px solid transparent" role="presentation">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;font-size:0px"><img src="https://greenloop-plataformagestion.s3.amazonaws.com/galeria/key-image.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic" width="300" class="adapt-img" height="300"></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-txt-c es-m-p10b" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:25px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-size:25px;font-style:normal;font-weight:bold;color:#15304d;margin-bottom:28px">Hola, ${name}</h1></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-txt-c es-m-p10b" style="padding:0;Margin:0;padding-bottom:15px"><h1 style="Margin:0;line-height:40px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-size:40px;font-style:normal;font-weight:bold;color:#15304d;margin-bottom:28px"><strong>Bienvenido/a&nbsp;a Green loop</strong></h1></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-p20r es-m-p20l" style="padding:0;Margin:0;padding-top:10px;padding-left:35px;padding-right:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;line-height:17px;margin-bottom:9px;color:#15304d;font-size:14px">Esta es tu contraseña temporal. Te sugerimos cambiarla lo más pronto posible.</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" bgcolor="#fafafa" style="padding:0;Margin:0;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#fafafa">
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:10px solid transparent;border-right:10px solid transparent;border-radius:5px" role="presentation">
                     <tr>
                      <td align="center" class="es-m-txt-c es-m-p10t es-m-p10b" style="padding:0;Margin:0"><h1 style="Margin:0;line-height:30px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#15304d;margin-bottom:28px">${password}</h1></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-txt-c" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px"><!--[if mso]><a href="" target="_blank" hidden>
	<v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="" 
                style="height:44px; v-text-anchor:middle; width:252px" arcsize="18%" stroke="f"  fillcolor="#15304d">
		<w:anchorlock></w:anchorlock>
		<center style='color:#eef1f4; font-family:"trebuchet ms", "lucida grande", "lucida sans unicode", "lucida sans", tahoma, sans-serif; font-size:18px; font-weight:700; line-height:18px;  mso-text-raise:1px'>Ingresar ahora</center>
	</v:roundrect></a>
<![endif]--><!--[if !mso]><!-- --><span class="msohide es-button-border-2 es-button-border" style="border-style:solid;border-color:#2CB543;background:#15304d;border-width:0px;display:inline-block;border-radius:8px;width:auto;mso-hide:all"><a href="" class="es-button es-button-1 msohide" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#eef1f4;font-size:20px;display:inline-block;background:#15304d;border-radius:8px;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-weight:bold;font-style:normal;line-height:24px;width:auto;text-align:center;padding:10px 50px;mso-padding-alt:0;mso-border-alt:10px solid #8061ED;mso-hide:all">Ingresar ahora</a></span><!--<![endif]--></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table class="es-footer-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
             <tr>
              <td align="left" bgcolor="#fafafa" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:20px;padding-right:20px;background-color:#fafafa">
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;border-left:10px solid transparent;border-right:10px solid transparent" role="presentation">
                     <tr>
                      <td align="center" style="padding:20px;Margin:0;font-size:0px">
                       <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:30px"><a target="_blank" href="https://es-la.facebook.com/greenloopltda/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="Facebook" src="https://greenloop-plataformagestion.s3.amazonaws.com/galeria/facebook-rounded-black-bordered.png" alt="Fb" height="32" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:30px"><a target="_blank" href="https://www.instagram.com/greenloopltda/?hl=es-la" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#333333;font-size:12px"><img title="Instagram" src="https://greenloop-plataformagestion.s3.amazonaws.com/galeria/instagram-rounded-black-bordered.png" alt="Ig" height="32" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></a></td>
                          <td align="center" valign="top" style="padding:0;Margin:0"><img title="Linkedin" src="https://greenloop-plataformagestion.s3.amazonaws.com/galeria/linkedin-rounded-black-bordered.png" alt="In" height="32" width="32" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic"></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;line-height:16px;margin-bottom:8px;color:#333333;font-size:13px">Av. El Dorado No. 69-63 Ofc 316 Edificio Torre 26.</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;line-height:14px;margin-bottom:8px;color:#333333;font-size:12px"><br></p></td>
                     </tr>
                     <tr>
                      <td style="padding:0;Margin:0">
                       <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr class="links">
                          <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0"><a target="_blank" href="https://green-loop.com/" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;color:#8d8d8d;font-size:12px;font-weight:bold">Visítanos</a></td>
                          <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0;border-left:1px solid #cccccc"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;color:#8d8d8d;font-size:12px;font-weight:bold">Política de privacidad</a></td>
                          <td align="center" valign="top" width="33.33%" style="Margin:0;padding-left:5px;padding-right:5px;padding-top:5px;padding-bottom:5px;border:0;border-left:1px solid #cccccc"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:none;display:block;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;color:#8d8d8d;font-size:12px;font-weight:bold">Condiciones de uso</a></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
         <tr>
          <td class="es-info-area" align="center" style="padding:0;Margin:0">
           <table class="es-content-body" align="center" cellpadding="0" cellspacing="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px" bgcolor="#FFFFFF">
             <tr>
              <td align="left" bgcolor="#fafafa" style="padding:20px;Margin:0;background-color:#fafafa;border-radius:0px 0px 10px 10px">
               <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" class="es-infoblock" style="padding:0;Margin:0;line-height:14px;font-size:12px;color:#CCCCCC;margin-bottom:8px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;line-height:18px;margin-bottom:8px;color:#8d8d8d;font-size:12px"><a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>Green Loop LTDA<a href="https://agenciamarketingdigital.com.co/diseno-de-paginas-web/" target="_blank" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a>- Bogotá | Colombia, Reservados todos los derechos.<a target="_blank" href="" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;text-decoration:underline;color:#CCCCCC;font-size:12px"></a></p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table></td>
     </tr>
      `,
    };
    try {
      transporter.sendMail(message);
      return res.status(200).json({ status: 'message sent' });
    } catch {
      return res.status(500).json({ status: 'error sending message' });
    }
  }
  return res.status(500).json({ status: 'error sending message' });
};

export default SendMail;
