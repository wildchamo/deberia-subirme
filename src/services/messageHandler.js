import { searchReviewsbyPlate, saveReview, saveQuery } from "./db.js";
import whatsappService from "./whatsappService.js";
class MessageHandler {
  constructor() {
    this.reportForm = {};
  }

  async handleIncomingMessage(message, senderInfo) {
    switch (message?.type) {
      case "text":
        const incomingMessage = message.text.body.toLowerCase().trim();

        await this.sendWelcomeMessage(message.from, message.id);
        await this.sendWelcomeMenu(message.from);

        break;
      case "interactive":
        break;

      default:
        await this.sendWelcomeMessage(message.from, message.id);
        await this.sendWelcomeMenu(message.from);
        break;
    }
  }

  async sendWelcomeMessage(to, messageId) {
    const welcomeMessage =
      "¡Hola! \n*Bienvenidx a Trazza,* tu canal para reportar o consultar cualquier situación relacionada con un viaje. 🚗\nEstamos aquí para ayudarte. ¿Con qué te apoyamos hoy?";

    await whatsappService.sendMessage(to, welcomeMessage, messageId);
  }

  async sendWelcomeMenu(to) {
    const title = "Selecciona una opción:";
    const buttons = [
      {
        type: "reply",
        reply: {
          id: "hacer-consulta",
          title: "Hacer una consulta 💬",
        },
      },
      {
        type: "reply",
        reply: { id: "reportar-incidente", title: "Reportar incidente ⚠️" },
      },
    ];

    console.log(title, buttons, to);
    await whatsappService.sendInteractiveButtons(to, title, buttons);
  }
}

export default new MessageHandler();
