import AfriAIProductEntitlementCatalog from "../catalog/AfriAIProductEntitlementCatalog.js";

const AfriDebugEntitlement = {

  register(){

    return AfriAIProductEntitlementCatalog.register(
      "AfriDebug",
      {

        name:"AfriDebug",

        status:"ACTIVE",

        version:"1.0",

        capabilities:{

          diagnosis:{
            name:"Repository Diagnosis",
            description:"Analyze a repository and identify likely problems.",
            actions:[
              "repository_intake",
              "dependency_analysis",
              "runtime_inspection"
            ]
          },

          investigation:{
            name:"Deep Investigation",
            description:"Perform structured debugging investigation.",
            actions:[
              "log_analysis",
              "stack_trace_analysis",
              "knowledge_comparison"
            ]
          },

          patching:{
            name:"AI Patch Planning",
            description:"Generate structured repair plans and candidate patches.",
            actions:[
              "patch_planning",
              "patch_generation"
            ]
          },

          verification:{
            name:"Verification & Regression Testing",
            description:"Validate proposed fixes and regression behavior.",
            actions:[
              "verification",
              "regression_testing"
            ]
          },

          evidence:{
            name:"Evidence & Delivery",
            description:"Generate evidence reports and delivery artifacts.",
            actions:[
              "evidence_report",
              "delivery_package"
            ]
          }

        },

        plans:{

          free:{
            capabilities:[
              "diagnosis.repository_intake",
              "diagnosis.dependency_analysis"
            ],

            benefits:[
              "Basic repository intake",
              "Basic dependency inspection",
              "Limited debugging guidance"
            ],

            limits:{
              investigations:"LIMITED",
              patchGeneration:false,
              verification:false,
              evidenceReports:"LIMITED"
            }
          },

          starter:{
            capabilities:[
              "diagnosis.repository_intake",
              "diagnosis.dependency_analysis",
              "diagnosis.runtime_inspection",
              "investigation.log_analysis"
            ],

            benefits:[
              "Expanded repository diagnosis",
              "Runtime inspection",
              "Log analysis",
              "More debugging investigations"
            ],

            limits:{
              investigations:"ADMIN_CONFIGURED",
              patchGeneration:"LIMITED",
              verification:"LIMITED",
              evidenceReports:"LIMITED"
            }
          },

          pro:{
            capabilities:[
              "diagnosis.*",
              "investigation.*",
              "patching.*",
              "verification.*",
              "evidence.*"
            ],

            benefits:[
              "Full debugging investigation",
              "AI patch planning",
              "Candidate patch generation",
              "Verification and regression testing",
              "Evidence reports"
            ],

            limits:{
              investigations:"ADMIN_CONFIGURED",
              patchGeneration:"ADMIN_CONFIGURED",
              verification:"ADMIN_CONFIGURED",
              evidenceReports:"ADMIN_CONFIGURED"
            }
          },

          enterprise:{
            capabilities:[
              "*"
            ],

            benefits:[
              "Full AfriDebug capability access",
              "Custom usage limits",
              "Advanced debugging workflows",
              "Custom integrations",
              "Enterprise evidence and delivery workflows"
            ],

            limits:{
              investigations:"CUSTOM",
              patchGeneration:"CUSTOM",
              verification:"CUSTOM",
              evidenceReports:"CUSTOM"
            }
          }

        },

        payg:{

          enabled:true,

          capabilities:{

            diagnosis:{
              enabled:true,
              mode:"ONE_TIME"
            },

            investigation:{
              enabled:true,
              mode:"ONE_TIME"
            },

            patching:{
              enabled:true,
              mode:"ONE_TIME"
            },

            verification:{
              enabled:true,
              mode:"ONE_TIME"
            },

            evidence:{
              enabled:true,
              mode:"ONE_TIME"
            }

          }

        },

        adUnlock:{

          enabled:true,

          capabilities:{

            diagnosis:{
              enabled:true,
              mode:"ADMIN_CONFIGURED"
            },

            investigation:{
              enabled:true,
              mode:"ADMIN_CONFIGURED"
            },

            patching:{
              enabled:false
            },

            verification:{
              enabled:false
            },

            evidence:{
              enabled:true,
              mode:"ADMIN_CONFIGURED"
            }

          }

        },

        upgradeBenefits:{

          starter:{
            from:"free",
            benefits:[
              "More AfriDebug investigations",
              "Runtime inspection",
              "Log analysis",
              "Expanded debugging access"
            ]
          },

          pro:{
            from:"starter",
            benefits:[
              "Full investigation lifecycle",
              "AI patch planning",
              "Patch generation",
              "Verification",
              "Regression testing",
              "Evidence generation"
            ]
          },

          enterprise:{
            from:"pro",
            benefits:[
              "Custom limits",
              "Custom integrations",
              "Enterprise workflows",
              "Advanced delivery capabilities"
            ]
          }

        },

        metadata:{
          category:"developer_tools",
          monetization:"subscription_payg_ad_unlock",
          humanApprovalRequired:true,
          source:"AfriDebug"
        }

      }
    );

  }

};

export default AfriDebugEntitlement;
