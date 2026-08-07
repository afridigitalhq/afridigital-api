/**
 * AfriDesign Studio Dashboard
 *
 * Purpose:
 * Bottom workspace dashboard.
 *
 * Rule:
 * Composition only.
 */

import DashboardPanelRegistry from "./registry/DashboardPanelRegistry";

export default function StudioDashboard(){

  return (

    <section className="studio-dashboard">

      {
        DashboardPanelRegistry.map(panel => (

          <section
            key={panel.id}
            className="dashboard-panel"
          >

            <header className="dashboard-panel-title">

              <span>{panel.icon}</span>

              <h3>{panel.name}</h3>

            </header>

            <div className="dashboard-panel-body">

              {panel.placeholder}

            </div>

          </section>

        ))
      }

    </section>

  );

}
