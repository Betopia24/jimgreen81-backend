import cron from "node-cron";
import { updateSubscriptionUseCronJob } from "./subscription";

export function startNotificationCrons() {
  cron.schedule("0 */12 * * *", updateSubscriptionUseCronJob);
}
