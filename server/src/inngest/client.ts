import { EventSchemas, Inngest } from "inngest";
import { EventsSchema } from "./events";

export const inngest = new Inngest({
  id: "pingup-app",
  schemas: new EventSchemas().fromRecord<EventsSchema>(),
});
