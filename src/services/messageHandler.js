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
          await whatsappService.markAsReadWithTyping(message.id);

          return await this.handleReportFlow(message.from, incomingMessage);
        }

        await this.sendWelcomeMenu(message.from);

        break;
      case "interactive":
        if (this.reportForm[message.from]) {
          return await this.handleReportFlow(message.from, message);
        }

        const chosenOption = message.interactive.button_reply.id.trim();
        await this.handleMenuOption(message.from, chosenOption);

        break;

      default:
        await this.sendWelcomeMessage(message.from, message.id);
        await this.sendWelcomeMenu(message.from);
        break;
    }
  }

  async sendNeedMoreHelp(to) {
    const title =
      "¿Necesitas ayuda con algo más? 💬\nEstamos aquí para apoyarte en lo que necesites.";
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
        reply: { id: "reportar-incidente", title: "2️⃣ Reportar placa" },
      },
    ];

    await whatsappService.sendInteractiveButtons(to, title, buttons);
  }

  async sendWelcomeMenu(to) {
    const title = `Hey! Nomo te saluda 💜 \nBienvenidx a esta comunidad que te cuida en el transporte público individual. 

¿Qué quieres hacer hoy?`;
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
        reply: { id: "reportar-incidente", title: "2️⃣ Reportar placa" },
      },
      {
        type: "reply",
        reply: { id: "apoyar-proyecto", title: "💰 Apoyar proyecto" },
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
        await whatsappService.sendMessage(to, response);

        break;

      case "reportar-incidente":
        this.reportForm[to] = { step: "plate" };
        response = `¡Gracias por compartir tu experiencia con la comunidad!
Sabemos que tu reseña ayudará a proteger la vida de alguien más 🫂💜
 \n Primero, ingresa la placa del vehículo en el siguiente formato: *ABC123*`;

        await whatsappService.sendMessage(to, response);

        break;

      case "apoyar-proyecto":
        await whatsappService.sendCtaUrlMessage({
          to,
          headerText: "Salva vidas apoyando a NoMo",
          bodyText:
            "Tu ayuda hace la diferencia. Todas las donaciones serán usadas para mantener y mejorar el proyecto.",
          footerText: "¡Gracias por tu apoyo!",
          displayText: "Hacer una donación",
          url: "https://wildchamo.github.io/nomo-landing/apoyar.html",
        });

        break;

      default:
        response =
          "Lo siento, no entendí tu selección, elige una opción del menú";
        await whatsappService.sendMessage(to, response);
    }
  }

  async handleQueryFlow(to, message) {
    const state = this.reportQuery[to];

    delete this.reportQuery[to];

    const plate = message.toUpperCase();

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
        reportSummary += `- ${categoryCounts[category]} reporte(s) de tipo ${
          this.rows.find((row) => row.id === category).title
        }\n`;
      }

      reportSummary +=
        "\nRecuerda que estos reportes NO están verificados y fueron hechos por la comunidad. Nuestro objetivo es informarte y prevenirte antes de que decidas subirte a un vehículo. \n¿Hay algo más en lo que pueda ayudarte?";

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
          reply: { id: "reportar-incidente", title: "2️⃣ Reportar placa" },
        },
        {
          type: "reply",
          reply: { id: "apoyar-proyecto", title: "💰 Apoyar proyecto" },
        },
      ];

      await whatsappService.sendInteractiveButtons(to, reportSummary, buttons);
    } else {
      title = `❌ El vehículo con placa ${plate} no cuenta con registros en nuestra plataforma. No olvides consultar la próxima vez que vayas a subirte a un vehículo; nuestro objetivo es informarte y prevenirte. ¿Hay algo más en lo que pueda ayudarte?`;

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
          reply: { id: "reportar-incidente", title: "2️⃣ Reportar placa" },
        },
        {
          type: "reply",
          reply: { id: "apoyar-proyecto", title: "💰 Apoyar proyecto" },
        },
      ];

      await whatsappService.sendInteractiveButtons(to, title, buttons);
    }
  }

  async handleReportFlow(to, message) {
    const state = this.reportForm[to];

    let response;

    switch (state.step) {
      case "plate":
        const plate = message.toUpperCase();
        state.step = "category";
        state.plate = plate;
        await whatsappService.sendListMessage({
          to,
          bodyText:
            "Ahora, selecciona la categoría que mejor describa tu experiencia",
          buttonText: "Seleccionar",
          rows: this.rows,
        });
        break;
      case "category":
        state.step = "description";
        const category = message.interactive.list_reply.id;
        state.category = category;

        response = `¡Listo!.\n Si lo deseas, puedes compartir una breve descripción de lo que sucedió. 

💜Esta información es opcional ,pero muy valiosa para ayudar a otros.\n Si prefieres no añadir una descripción, envía un punto (.) o la palabra “ok” para continuar.
        `;

        break;
      case "description":
        state.description = message;

        await saveReview({
          number: to,
          plate: state.plate,
          type: state.category,
          description: message,
        });
        delete this.reportForm[to];

        title = `Gracias por compartir tu experiencia con nosotros. \n\nTu reseña ha sido registrada con éxito.\nRecuerda que tu opinión es valiosa y ayuda a crear un entorno más seguro para todos. \n\n¿Hay algo más en lo que pueda ayudarte?`;

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
            reply: { id: "reportar-incidente", title: "2️⃣ Reportar placa" },
          },
          {
            type: "reply",
            reply: { id: "apoyar-proyecto", title: "💰 Apoyar proyecto" },
          },
        ];

        await whatsappService.sendInteractiveButtons(to, title, buttons);

        response = null;
        break;
    }

    if (response) await whatsappService.sendMessage(to, response);
  }
}

export default new MessageHandler();
