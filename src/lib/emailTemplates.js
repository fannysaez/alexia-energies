// Template email pour la réinitialisation de mot de passe
export function getResetPasswordEmailTemplate(resetUrl) {
  return `
<table style="background: #f7f6f2; font-family: 'Work Sans', Arial, sans-serif; color: #222;" width="100%" cellspacing="0" cellpadding="0">
  <tbody>
    <tr>
      <td style="padding: 40px 0;" align="center">
        <table style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #eaeaea;" width="600" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td style="padding: 40px 32px 40px 32px; text-align: center;">

                <!-- Logo -->
                <div style="text-align: center; margin-bottom: 32px;">
                  <img style="height: 60px;" src="https://res.cloudinary.com/ddvgydnpm/image/upload/v1754799926/alexia-energies/logo-astronex.png" alt="Alexia Energies">
                </div>

                <!-- Notification -->
                <h2 style="margin-bottom: 24px; color: #7c6a46;">Réinitialisation de votre mot de passe</h2>

                <!-- Message content -->
                <div style="margin-bottom: 32px; text-align: center;">
                  <p>Bonjour,</p>
                  <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour le faire :</p>
                </div>

                <!-- CTA Button -->
                <a style="display: inline-block; background: #7c6a46; color: #fff; text-decoration: none; padding: 14px 36px; border-radius: 6px; font-weight: 600; font-size: 1rem; margin-top: 24px;" href="${resetUrl}">Réinitialiser mon mot de passe</a>

                <p style="margin-top: 32px; color: #7c6a46;">Ce lien expirera dans une heure.</p>

                <!-- Lien de fallback -->
                <div style="margin-top: 32px; padding: 20px; background: #f9f9f9; border-radius: 6px;">
                  <p style="font-size: 14px; color: #666; margin: 0;">
                    Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                  </p>
                  <p style="font-size: 14px; color: #7c6a46; word-break: break-all; margin: 8px 0 0 0;">
                    ${resetUrl}
                  </p>
                </div>

                <p style="margin-top: 24px; font-size: 14px; color: #999;">
                  Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
                </p>

                <!-- Footer -->
                <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;">
                <p style="text-align: center; font-size: 0.95rem; color: #7c6a46; margin-bottom: 0;">
                  Suivez-moi :
                  <a style="color: #7c6a46; text-decoration: none;" href="https://instagram.com">Instagram</a> |
                  <a style="color: #7c6a46; text-decoration: none;" href="https://facebook.com">Facebook</a> |
                  <a style="color: #7c6a46; text-decoration: none;" href="https://linkedin.com">LinkedIn</a> |
                  <a style="color: #7c6a46; text-decoration: none;" href="https://youtube.com">YouTube</a>
                </p>

              </td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
    `;
}
