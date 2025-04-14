"use client"

const ContentNav = ({ selectedNav, onNavChange }) => {
  const navItems = [
    { key: "community", label: "Community" },
    { key: "workspace", label: "Workspace" },
    { key: "personal", label: "Personal" },
  ]

  return (
    <div className="content-nav-container">
      <div className="content-nav">
        {navItems.map((item) => (
          <div
            key={item.key}
            className={`nav-item ${selectedNav === item.key ? "active" : ""}`}
            onClick={() => onNavChange(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ContentNav
