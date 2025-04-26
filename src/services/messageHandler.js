import { searchReviewsbyPlate, saveReview, saveQuery } from "./db.js";
import whatsappService from "./whatsappService.js";
class MessageHandler {
  constructor() {
    this.reportForm = {};
    this.reportQuery = {};
  }

  async handleIncomingMessage(message, senderInfo) {
    await whatsappService.markAsRead(message.id);

    switch (message?.type) {
      case "text":
        const incomingMessage = message.text.body.toLowerCase().trim();

        if (this.reportQuery[message.from]) {
          return await this.handleQueryFlow(message.from, incomingMessage);
        }

        if (this.reportForm[message.from]) {
          return await this.handleReportFlow(message.from, incomingMessage);
        }

        await this.sendWelcomeMessage(message.from, message.id);
        await this.sendWelcomeMenu(message.from);

        break;
      case "interactive":
        const chosenOption = message.interactive.button_reply.id.trim();
        await this.handleMenuOption(message.from, chosenOption);

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

  async handleMenuOption(to, option) {
    let response;

    switch (option) {
      case "hacer-consulta":
        this.reportQuery[to] = { step: "plate" };

        response =
          "¡Claro! Por favor, ingresa la placa del vehículo en el formato *ABC-123* para continuar.";
        break;

      //TODO
      case "reportar-incidente":
        this.reportQuery[to] = { step: "category" };
        response =
          "Gracias por tu confianza. \nPara entender mejor lo que ocurrió, por favor selecciona la categoría que mejor describe la situación.";
        break;

      default:
        response =
          "Lo siento, no entendí tu selección, elige una opción del menú";
    }

    await whatsappService.sendMessage(to, response);
  }
}

export default new MessageHandler();
