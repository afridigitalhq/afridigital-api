import Dashboard from "./dashboard/AfriDebugDashboardAdmin.js";
import Developers from "./developers/AfriDebugDevelopersAdmin.js";
import Projects from "./projects/AfriDebugProjectsAdmin.js";
import Repositories from "./repositories/AfriDebugRepositoriesAdmin.js";
import Cases from "./cases/AfriDebugCasesAdmin.js";
import Queue from "./queue/AfriDebugQueueAdmin.js";
import Monitoring from "./monitoring/AfriDebugMonitoringAdmin.js";
import Repair from "./repair/AfriDebugRepairAdmin.js";
import Knowledge from "./knowledge/AfriDebugKnowledgeAdmin.js";
import Billing from "./billing/AfriDebugBillingAdmin.js";
import Credits from "./credits/AfriDebugCreditsAdmin.js";
import Subscriptions from "./subscriptions/AfriDebugSubscriptionsAdmin.js";
import ApiKeys from "./apikeys/AfriDebugApiKeysAdmin.js";
import Organizations from "./organizations/AfriDebugOrganizationsAdmin.js";
import Notifications from "./notifications/AfriDebugNotificationsAdmin.js";
import Security from "./security/AfriDebugSecurityAdmin.js";
import Runtime from "./runtime/AfriDebugRuntimeAdmin.js";
import Settings from "./settings/AfriDebugSettingsAdmin.js";
import Audit from "./audit/AfriDebugAuditAdmin.js";

const modules = {
  dashboard: Dashboard,
  developers: Developers,
  projects: Projects,
  repositories: Repositories,
  cases: Cases,
  queue: Queue,
  monitoring: Monitoring,
  repair: Repair,
  knowledge: Knowledge,
  billing: Billing,
  credits: Credits,
  subscriptions: Subscriptions,
  apikeys: ApiKeys,
  organizations: Organizations,
  notifications: Notifications,
  security: Security,
  runtime: Runtime,
  settings: Settings,
  audit: Audit
};

export default {
  list() {
    return Object.keys(modules);
  },
  get(name) {
    return modules[name] || null;
  },
  modules
};
