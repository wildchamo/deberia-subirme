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

  async sendWelcomeMessage(to) {
    const welcomeMessage =
      "*Hey! Nomo te saluda.* \nBienvenidx a esta herramienta creada por ti y para ti. Aquí podrás consultar si una placa vehicular tiene algún reporte negativo o registrar una mala experiencia que hayas tenido en el servicio de transporte público individual para que nadie vuelva a pasar por lo mismo.";

    await whatsappService.sendMessage(to, welcomeMessage);
  }

  async sendNeedMoreHelp(to) {
    const message =
      "¿Necesitas ayuda con algo más? 💬\nEstamos aquí para apoyarte en lo que necesites relacionado con tu viaje.";

    await whatsappService.sendMessage(to, message);
  }

  async sendWelcomeMenu(to) {
    const title = "¿Qué te gustaría hacer?";
    const buttons = [
      {
        type: "reply",
        reply: {
          id: "hacer-consulta",
          title: "1️⃣ Consultar una placa",
        },
      },
      {
        type: "reply",
        reply: { id: "reportar-incidente", title: "2️⃣ Registrar experiencia" },
      },
    ];

    await whatsappService.sendInteractiveButtons(to, title, buttons);
  }

  async handleMenuOption(to, option) {
    let response;

    switch (option) {
      case "hacer-consulta":
        this.reportQuery[to] = { step: "plate" };

        response =
          "Por favor, escribe el número de placa en el siguiente formato: *ABC123*";
        break;

      //TODO
      case "reportar-incidente":
        this.reportForm[to] = { step: "category" };
        response =
          "Gracias por tu confianza. \nPara entender mejor lo que ocurrió, por favor selecciona la categoría que mejor describe la situación.";
        break;

      default:
        response =
          "Lo siento, no entendí tu selección, elige una opción del menú";
    }

    await whatsappService.sendMessage(to, response);
  }

  async handleQueryFlow(to, message) {
    const state = this.reportQuery[to];

    delete this.reportQuery[to];

    const plate = message.toUpperCase();

    const response = "Estamos consultando la información, por favor espera...";

    await whatsappService.sendMessage(to, response);

    await saveQuery({
      number: to,
      plate,
    });

    const reviews = await searchReviewsbyPlate(plate);

    if (reviews.length > 0) {
      const categoryCounts = {};
      reviews.forEach((category) => {
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      });

      let reportSummary = `Nomo encontró algo 🔎:\n el vehículo con placa ${plate} tiene los siguientes reportes:`;
      for (const category in categoryCounts) {
        reportSummary += `- ${categoryCounts[category]} reporte(s) de tipo ${category}\n`;
      }

      await whatsappService.sendMessage(to, reportSummary);

      await whatsappService.sendMessage(
        to,
        "Recuerda que estos reportes NO están verificados y fueron hechos por la comunidad. Nuestro objetivo es informarte y prevenirte antes de que decidas subirte a un vehículo. ¿Hay algo más en lo que pueda ayudarte?"
      );
    } else {
      await whatsappService.sendMessage(
        to,
        `❌ El vehículo con placa ${plate} no cuenta con registros en nuestra plataforma. No olvides consultar la próxima vez que vayas a subirte a un vehículo; nuestro objetivo es informarte y prevenirte. ¿Hay algo más en lo que pueda ayudarte?`
      );
    }

    await this.sendNeedMoreHelp(to);

    await this.sendWelcomeMenu(to);

    console.log(reviews);
  }

  async handleReportFlow(to, message) {
    const state = this.reportForm[to];

    const plate = message.toUpperCase();

    const response = "Estamos registrando la información, por favor espera...";

    await whatsappService.sendMessage(to, response);

    await saveReview({
      number: to,
      plate,
      category: state.category,
      description: message,
    });
  }
}

export default new MessageHandler();
