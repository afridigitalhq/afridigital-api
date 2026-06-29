export class BattlefieldRoom {

  constructor() {
    this.users = [];
    this.incidents = [];
  }

  join(user) {
    this.users.push(user);
    return {
      status: "JOINED_SOC_BATTLEFIELD",
      activeUsers: this.users.length
    };
  }

  broadcastIncident(incident) {
    this.incidents.push(incident);

    return {
      type: "LIVE_INCIDENT_BROADCAST",
      viewers: this.users.length,
      incident
    };
  }

  getState() {
    return {
      users: this.users,
      incidents: this.incidents,
      mode: "MULTI_USER_READ_ONLY_WARROOM"
    };
  }
}
