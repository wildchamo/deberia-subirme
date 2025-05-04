import { searchReviewsbyPlate, saveReview, saveQuery } from "./db.js";
import whatsappService from "./whatsappService.js";
class MessageHandler {
  constructor() {
    this.reportForm = {};
    this.reportQuery = {};

    this.rows = [
      {
        id: "1",
        title: "Comportamiento agresivo",
      },
      {
        id: "2",
        title: "Conducción peligrosa",
      },
      {
        id: "3",
        title: "Robo",
      },
      {
        id: "4",
        title: "Acoso sexual",
      },
      {
        id: "5",
        title: "Abuso sexual",
      },

      {
        id: "6",
        title: "Consumo de sustancias",
      },
      {
        id: "7",
        title: "Discriminación",
      },
      {
        id: "8",
        title: "No coincide con la foto",
      },
    ];
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
          title: "1️⃣ Consultar placa",
        },
      },
      {
        type: "reply",
        reply: { id: "reportar-incidente", title: "2️⃣ Registrar viaje" },
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
          "Por favor, escribe el número de placa en el siguiente formato: *ABC-123*";
        break;

      case "reportar-incidente":
        this.reportForm[to] = { step: "plate" };
        response =
          "Agradecemos que quieras compartir tu experiencia con la comunidad. Creemos firmemente que tu reseña ayudará a proteger la vida de alguien más. \n Primero, ingresa la placa del vehículo en el siguiente formato: ABC-123";
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

      let reportSummary = `Nomo encontró algo 🔎:\n el vehículo con placa ${plate} tiene los siguientes reportes:\n`;
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

    const userResponse = message.toUpperCase();

    let response;

    switch (state.step) {
      case "plate":
        const plate = userResponse;
        console.log("plate", plate);
        state.plate = plate;
        state.step = "category";

        console.log(this.rows);

        await whatsappService.sendListMessage({
          to,
          bodyText:
            "Ahora, selecciona la categoría que mejor describa tu experiencia",
          buttonText: "Seleccionar",
          rows: this.rows,
        });
        // response =
        //   "Ahora, responde solo con el número de la opción que mejor describa tu experiencia: \n1️1. Comportamiento agresivo\n2️2. Conducción peligrosa\n3️3. Robo\n4️4. Acoso sexual\n5️5. Abuso sexual\n6️6. Otro";
        break;
      case "category":
        state.step = "description";

        console.log("category");
        break;
      case "description":
        console.log("description");
        break;
    }

    if (response) await whatsappService.sendMessage(to, response);
  }
}

export default new MessageHandler();
