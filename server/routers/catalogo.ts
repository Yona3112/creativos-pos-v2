import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import nodemailer from "nodemailer";
import { ENV } from "../_core/env";

// Configurar transporter de nodemailer
// Nota: En producción, configurar con credenciales reales de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER || "tu-email@gmail.com",
    pass: process.env.GMAIL_APP_PASSWORD || "tu-app-password",
  },
});

export const catalogoRouter = router({
  solicitarCotizacion: publicProcedure
    .input(
      z.object({
        nombre: z.string().min(1),
        email: z.string().email(),
        telefono: z.string().min(1),
        mensaje: z.string().optional(),
        productos: z.array(
          z.object({
            productoId: z.number(),
            nombre: z.string(),
            precio: z.number(),
            cantidad: z.number(),
          })
        ),
        total: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        nombre,
        email,
        telefono,
        mensaje,
        productos,
        total,
      } = input;

      // Generar HTML del email
      const productosHTML = productos
        .map(
          (p) => `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">${p.nombre}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${p.cantidad}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">L ${p.precio.toFixed(2)}</td>
              <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">L ${(p.precio * p.cantidad).toFixed(2)}</td>
            </tr>
          `
        )
        .join("");

      const emailHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f9fafb; padding: 20px; }
            .table { width: 100%; border-collapse: collapse; background-color: white; margin: 20px 0; }
            .table th { background-color: #f3f4f6; padding: 12px; text-align: left; font-weight: 600; }
            .total-row { background-color: #eff6ff; font-weight: bold; font-size: 1.1em; }
            .info-box { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #2563eb; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Nueva Solicitud de Cotización</h1>
              <p>Creativos Gift Shop</p>
            </div>
            
            <div class="content">
              <div class="info-box">
                <h2 style="margin-top: 0; color: #2563eb;">Datos del Cliente</h2>
                <p><strong>Nombre:</strong> ${nombre}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Teléfono:</strong> ${telefono}</p>
                ${mensaje ? `<p><strong>Mensaje:</strong> ${mensaje}</p>` : ""}
              </div>

              <h2 style="color: #2563eb;">Productos Solicitados</h2>
              <table class="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio Unit.</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productosHTML}
                  <tr class="total-row">
                    <td colspan="3" style="padding: 12px; text-align: right;">TOTAL:</td>
                    <td style="padding: 12px; text-align: right; color: #2563eb;">L ${total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div class="info-box">
                <p style="margin: 0;"><strong>Nota:</strong> Este es un estimado basado en los precios actuales del catálogo. Por favor, contacta al cliente para confirmar disponibilidad y precio final.</p>
              </div>
            </div>

            <div class="footer">
              <p>Creativos Gift Shop - Sistema POS v2.0</p>
              <p>Este email fue generado automáticamente desde el catálogo público</p>
            </div>
          </div>
        </body>
        </html>
      `;

      try {
        // Enviar email al administrador
        const adminEmail = process.env.GMAIL_USER || "admin@creativos.com";
        
        await transporter.sendMail({
          from: `"Catálogo Creativos" <${process.env.GMAIL_USER || "noreply@creativos.com"}>`,
          to: adminEmail,
          subject: `Nueva Cotización de ${nombre} - L ${total.toFixed(2)}`,
          html: emailHTML,
          replyTo: email,
        });

        // Enviar email de confirmación al cliente
        const confirmacionHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 20px; }
              .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>¡Gracias por tu interés!</h1>
                <p>Creativos Gift Shop</p>
              </div>
              
              <div class="content">
                <p>Hola <strong>${nombre}</strong>,</p>
                <p>Hemos recibido tu solicitud de cotización por un total de <strong>L ${total.toFixed(2)}</strong>.</p>
                <p>Nuestro equipo revisará tu solicitud y te contactaremos pronto al número <strong>${telefono}</strong> o al email <strong>${email}</strong> con la cotización detallada.</p>
                <p>Si tienes alguna pregunta adicional, no dudes en contactarnos.</p>
                <p>¡Gracias por elegirnos!</p>
              </div>

              <div class="footer">
                <p>Creativos Gift Shop</p>
                <p>Este es un email automático, por favor no respondas a este mensaje</p>
              </div>
            </div>
          </body>
          </html>
        `;

        await transporter.sendMail({
          from: `"Creativos Gift Shop" <${process.env.GMAIL_USER || "noreply@creativos.com"}>`,
          to: email,
          subject: "Confirmación de Solicitud de Cotización - Creativos Gift Shop",
          html: confirmacionHTML,
        });

        return {
          success: true,
          message: "Cotización enviada exitosamente",
        };
      } catch (error) {
        console.error("Error al enviar email:", error);
        
        // Si falla el envío de email, al menos registrar la solicitud
        // En producción, podrías guardar esto en la base de datos
        return {
          success: true,
          message: "Cotización recibida. Te contactaremos pronto.",
          warning: "Email no configurado. Contacta al administrador.",
        };
      }
    }),
});
