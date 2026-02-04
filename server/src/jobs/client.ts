import { EventSchemas, Inngest } from "inngest";
import { EventsSchema } from "@/jobs/events";

export const inngest = new Inngest({
  id: "pingup-app",
  schemas: new EventSchemas().fromRecord<EventsSchema>(),
});
