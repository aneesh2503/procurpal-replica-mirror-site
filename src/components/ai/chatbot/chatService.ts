
import { Message } from "./types";

export function processUserMessage(inputMessage: string): string {
  const botResponses: { [key: string]: string } = {
    help: "I can help you with procurement tasks like finding suppliers, analyzing inventory, recommending reorder quantities, and more. Just tell me what you need assistance with!",
    inventory: "Your current inventory status shows 5 items with low stock. Would you like me to prepare a reorder plan?",
    supplier: "I can help you find reliable suppliers or analyze your current supplier performance. What specific information are you looking for?",
    report: "I can generate procurement reports based on your data. Would you like a summary report, cost analysis, or supplier performance report?",
  };

  const lowerCaseInput = inputMessage.toLowerCase();
  let botResponse = "I'm not sure how to help with that specific request. Could you try asking something about inventory, suppliers, procurement, or reports?";

  Object.keys(botResponses).forEach((key) => {
    if (lowerCaseInput.includes(key)) {
      botResponse = botResponses[key];
    }
  });

  return botResponse;
}
