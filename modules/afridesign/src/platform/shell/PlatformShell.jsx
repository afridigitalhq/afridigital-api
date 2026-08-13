import { useState, useEffect } from 'react';
import PlatformWorkspaceSwitcher from './PlatformWorkspaceSwitcher';
import AfriStudioRegistry from '../studios/AfriStudioRegistry';
import PlatformWorkspaceController from './PlatformWorkspaceController';

export default function PlatformShell() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [activeStudio, setActiveStudio] = useState('afridesign');
  const [activeService, setActiveService] = useState('projects');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allStudios = AfriStudioRegistry;

  const services = [
    { id: 'projects', icon: '📁', name: 'Projects' },
    { id: 'assets', icon: '🖼', name: 'Assets' },
    { id: 'templates', icon: '🧩', name: 'Templates' },
    { id: 'cloud', icon: '☁️', name: 'Cloud' },
    { id: 'build', icon: '🚀', name: 'Build' },
    { id: 'deploy', icon: '🌍', name: 'Deploy' },
    { id: 'teams', icon: '👥', name: 'Teams' },
    { id: 'marketplace', icon: '🛒', name: 'Marketplace' },
  ];

  const quickTools = [
    'Color Picker', 'Gradient', 'Typography', 'Shadow', 
    'Grid System', 'Breakpoints', 'Spacing', 'Effects', 
    'Export UI', 'Icons', 'Charts', 'Maps'
  ];

  const activityFeed = [
    { action: 'You edited Home page', time: '2 mins ago' },
    { action: 'You added a new Button', time: '8 mins ago' },
    { action: 'You uploaded image.png', time: '10 mins ago' },
    { action: 'You published the project', time: '1 hour ago' },
  ];

  const recentProjects = [
    { name: 'AfriDigital Landing', time: 'Updated 2 mins ago' },
    { name: 'E-commerce App', time: 'Updated 1 hour ago' },
    { name: 'Brand Identity Design', time: 'Updated 3 hours ago' },
    { name: 'Real Estate Website', time: 'Updated yesterday' },
  ];

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      flexDirection: "column",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      color: "#ffffff",
      overflow: "hidden"
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "radial-gradient(circle at 20% 50%, rgba(233,69,96,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(108,92,231,0.08) 0%, transparent 50%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "10px",
        gap: "6px",
        overflow: "hidden"
      }}>
        {/* Header - Glass Card */}
        <header style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "14px",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
          flexWrap: "wrap",
          gap: "8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #e94560, #6c5ce7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 4px 15px rgba(233,69,96,0.3)"
            }}>🚀</div>
            <div>
              <span style={{ fontWeight: "bold", fontSize: "16px", background: "linear-gradient(135deg, #fff, #a8a8ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AfriDesign Studio</span>
              <span style={{ fontSize: "9px", opacity: 0.5, marginLeft: "8px", background: "rgba(233,69,96,0.2)", padding: "2px 10px", borderRadius: "8px", WebkitTextFillColor: "#e94560" }}>v2.0</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "14px", fontSize: "12px" }}>
            {['File', 'Edit', 'View', 'Project', 'Help'].map(item => (
              <span key={item} style={{ 
                cursor: "pointer", 
                opacity: 0.6, 
                padding: "4px 10px", 
                borderRadius: "6px",
                transition: "all 0.2s",
                background: "rgba(255,255,255,0.03)"
              }}
              onMouseEnter={e => { e.target.style.opacity = 1; e.target.style.background = "rgba(255,255,255,0.1)"; }}
              onMouseLeave={e => { e.target.style.opacity = 0.6; e.target.style.background = "rgba(255,255,255,0.03)"; }}
              >{item}</span>
            ))}
          </div>

          <button
            onClick={() => {}}
            style={{
              cursor: "pointer",
              padding: "6px 12px",
              borderRadius: "8px",
              border: "1px solid rgba(233,69,96,0.3)",
              background: "rgba(233,69,96,0.15)",
              color: "#fff"
            }}
          >
            🤖 AfriAI
          </button>
        </header>

        {/* Studio Switcher - EXACTLY 2 ROWS - NO WRAPPING */}
        <div style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "14px",
          padding: "8px 14px",
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          flexShrink: 0,
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
        }}>
          {/* ROW 1 - Visual, Web, App - NO WRAP */}
          <div style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "nowrap"
          }}>
            {allStudios.slice(0, 2).map(studio => (
              <div 
                key={studio.id}
                onClick={() => { setActiveStudio(studio.id); PlatformWorkspaceController.openStudio(studio.id); }}
                style={{
                  padding: "6px 20px",
                  background: activeStudio === studio.id ? "rgba(233,69,96,0.2)" : "rgba(255,255,255,0.03)",
                  border: activeStudio === studio.id ? "1px solid rgba(233,69,96,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: activeStudio === studio.id ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  boxShadow: activeStudio === studio.id ? "0 4px 15px rgba(233,69,96,0.15)" : "none",
                  flex: "0 1 auto"
                }}
              >
                <span style={{ fontSize: "16px" }}>{studio.icon}</span>
                <span style={{ fontWeight: activeStudio === studio.id ? "600" : "400" }}>{studio.name}</span>
              </div>
            ))}
          </div>
          
          {/* ROW 2 - Graphics, Video, Template - NO WRAP */}
          <div style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            flexWrap: "nowrap"
          }}>
            {allStudios.slice(2).map(studio => (
              <div 
                key={studio.id}
                onClick={() => { setActiveStudio(studio.id); PlatformWorkspaceController.openStudio(studio.id); }}
                style={{
                  padding: "6px 20px",
                  background: activeStudio === studio.id ? "rgba(233,69,96,0.2)" : "rgba(255,255,255,0.03)",
                  border: activeStudio === studio.id ? "1px solid rgba(233,69,96,0.3)" : "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  opacity: activeStudio === studio.id ? 1 : 0.6,
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  boxShadow: activeStudio === studio.id ? "0 4px 15px rgba(233,69,96,0.15)" : "none",
                  flex: "0 1 auto"
                }}
              >
                <span style={{ fontSize: "16px" }}>{studio.icon}</span>
                <span style={{ fontWeight: activeStudio === studio.id ? "600" : "400" }}>{studio.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Layout */}
        <div style={{
          display: "flex",
          flex: 1,
          gap: "6px",
          overflow: "hidden",
          minHeight: 0
        }}>
          {/* LEFT: Explorer + Tools - Glass Card */}
          <div style={{
            width: isMobile ? "0px" : "200px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: isMobile ? "0" : "12px",
            overflowY: "auto",
            flexShrink: 0,
            display: isMobile ? "none" : "block",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}>
            {/* File Explorer Card */}
            <div style={{ 
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              padding: "8px",
              marginBottom: "10px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ fontSize: "9px", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>📁 Explorer</div>
              <div style={{ fontSize: "10px", opacity: 0.7 }}>
                <div style={{ padding: "4px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >📄 index.html</div>
                <div style={{ padding: "4px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >📁 src/</div>
                <div style={{ padding: "2px 8px 2px 20px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s", fontSize: "9px" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >📁 components/</div>
                <div style={{ padding: "2px 8px 2px 20px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s", fontSize: "9px" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >📁 styles/</div>
                <div style={{ padding: "4px 8px 4px 20px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >📄 App.jsx</div>
              </div>
            </div>

            {/* Tools Card */}
            <div style={{ 
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              padding: "8px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <div style={{ fontSize: "9px", opacity: 0.4, textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: "6px" }}>🛠️ Tools</div>
              <div style={{ fontSize: "10px", opacity: 0.8 }}>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >✏️ Select</div>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >⬜ Rectangle</div>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >⬤ Circle</div>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >📝 Text</div>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >🖼️ Image</div>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >🔗 Link</div>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >📦 Container</div>
                <div style={{ padding: "3px 8px", cursor: "pointer", borderRadius: "4px", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.target.style.background = "rgba(255,255,255,0.06)"; }}
                  onMouseLeave={e => { e.target.style.background = "transparent"; }}
                >⚡ Component</div>
                <div style={{ 
                  padding: "4px 8px", 
                  cursor: "pointer", 
                  borderRadius: "6px", 
                  background: "linear-gradient(135deg, #e94560, #6c5ce7)",
                  marginTop: "4px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "9px",
                  boxShadow: "0 4px 15px rgba(233,69,96,0.2)"
                }}>🎯 AI Assist</div>
              </div>
            </div>
          </div>

          {/* Center: Workspace Runtime */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            overflow: "hidden",
            minHeight: 0
          }}>
            <PlatformWorkspaceSwitcher />
          </div>

          {/* RIGHT: Inspector - Glass Card */}
          <div style={{
            width: isMobile ? "0px" : "200px",
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "14px",
            padding: isMobile ? "0" : "12px",
            overflowY: "auto",
            flexShrink: 0,
            display: isMobile ? "none" : "block",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
          }}>
            <div style={{ 
              background: "rgba(255,255,255,0.03)",
              borderRadius: "10px",
              padding: "10px",
              border: "1px solid rgba(255,255,255,0.05)"
            }}>
              <h4 style={{ margin: "0 0 8px 0", fontSize: "9px", opacity: 0.4, letterSpacing: "1px", textTransform: "uppercase" }}>ⓘ Inspector</h4>
              <div style={{ fontSize: "10px", opacity: 0.8 }}>
                <div style={{ 
                  background: "rgba(255,255,255,0.05)", 
                  padding: "6px 10px", 
                  borderRadius: "6px", 
                  marginBottom: "8px",
                  border: "1px solid rgba(255,255,255,0.04)"
                }}>
                  <strong>Selected:</strong> None
                </div>
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "4px 0" }}>
                  <div><strong>Width:</strong> auto</div>
                  <div><strong>Height:</strong> auto</div>
                  <div><strong>Padding:</strong> 0px</div>
                </div>
                <div style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", padding: "4px 0" }}>
                  <div><strong>Color:</strong> #ffffff</div>
                  <div><strong>Background:</strong> transparent</div>
                </div>
                <div style={{ padding: "4px 0" }}>
                  <div><strong>AI Suggested:</strong></div>
                  <div style={{ 
                    color: "#e94560", 
                    fontSize: "9px", 
                    marginTop: "4px", 
                    padding: "6px 10px", 
                    background: "rgba(233,69,96,0.08)", 
                    borderRadius: "6px",
                    border: "1px solid rgba(233,69,96,0.06)"
                  }}>
                    ✨ Use AI to enhance
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar - Glass Card */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "12px",
          padding: "4px 16px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "9px",
          flexShrink: 0,
          flexWrap: "wrap",
          gap: "4px",
          opacity: 0.5,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)"
        }}>
          <span>✨ Ready</span>
          <span>📦 Project: AfriDigital Landing</span>
          <span>💾 Auto-saved 2 mins ago</span>
          <span>📌 v1.0.0</span>
        </div>
      </div>
    </div>
  );
}
