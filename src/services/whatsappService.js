import { sendToWhatsapp } from "./http-request/sendToWhatsapp.js";
class WhatsAppService {
  async sendMessage(to, body) {
    const data = {
      messaging_product: "whatsapp",
      to,
      text: { body },
    };

    await sendToWhatsapp(data);
  }
  async markAsRead(messageId) {
    const data = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
    };
    await sendToWhatsapp(data);
  }
  async markAsReadWithTyping(messageId) {
    const data = {
      messaging_product: "whatsapp",
      status: "read",
      message_id: messageId,
      typing_indicator: {
        type: "text",
      },
    };
    await sendToWhatsapp(data);
  }

  async sendInteractiveButtons(to, bodyText, buttons) {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: buttons,
        },
      },
    };
    await sendToWhatsapp(data);
  }

  async sendMediaMessage(to, type, url, caption) {
    const mediaObject = {};

    console.log(type);
    switch (type) {
      case "image":
        mediaObject.image = { link: url, caption: caption };
        break;

      case "audio":
        mediaObject.audio = { link: url };
        break;

      case "video":
        mediaObject.video = { link: url, caption: caption };
        break;

      case "document":
        mediaObject.document = {
          link: url,
          caption: caption,
          filename: "archivo.pdf",
        };
        break;

      default:
        return console.log("No se encontro el tipo de archivo");
    }

    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: type,
      ...mediaObject,
    };

    await sendToWhatsapp(data);
  }

  async sendContactMessage(to, contact) {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "contacts",
      contacts: [contact],
    };
    await sendToWhatsapp(data);
  }

  async sendListMessage({ to, bodyText, buttonText, rows }) {
    const data = {
      messaging_product: "whatsapp",
      to,
      type: "interactive",
      interactive: {
        type: "list",
        body: { text: bodyText },
        action: {
          button: buttonText,
          sections: [
            {
              title: "Selecciona una opción",
              rows: rows,
            },
          ],
        },
      },
    };

    await sendToWhatsapp(data);
  }

  async sendCtaUrlMessage({
    to,
    headerText,
    bodyText,
    footerText,
    displayText,
    url,
  }) {
    const data = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to,
      type: "interactive",
      interactive: {
        type: "cta_url",
        header: {
          type: "text",
          text: headerText,
        },
        body: {
          text: bodyText,
        },
        footer: {
          text: footerText,
        },
        action: {
          name: "cta_url",
          parameters: {
            display_text: displayText,
            url: url,
          },
        },
      },
    };

    await sendToWhatsapp(data);
  }
}
export default new WhatsAppService();
